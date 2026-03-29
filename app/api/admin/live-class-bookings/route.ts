import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminSessionUser } from "@/lib/auth/admin";

type LiveClassBookingRow = {
  order_id: number;
  order_status: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  course_id: number;
  course_title: string;
  total_amount: number;
  discount_amount: number;
  payable_amount: number;
  currency: string;
  gateway: string | null;
  gateway_order_id: string | null;
  payment_status: string | null;
  gateway_payment_id: string | null;
  payment_method: string | null;
  payment_captured: boolean | null;
  email_notification_status: string | null;
  email_notification_attempt_count: number | null;
  email_notification_last_attempt_at: string | null;
  email_notification_error: string | null;
  whatsapp_notification_status: string | null;
  whatsapp_notification_attempt_count: number | null;
  whatsapp_notification_last_attempt_at: string | null;
  whatsapp_notification_error: string | null;
};

const RANGE_TO_INTERVAL: Record<string, string> = {
  "1h": "1 hour",
  "6h": "6 hours",
  "12h": "12 hours",
  "24h": "24 hours",
  "2d": "2 days",
  "7d": "7 days",
  "15d": "15 days",
  "30d": "30 days",
};

export async function GET(request: Request) {
  const adminSession = await getAdminSessionUser();
  if (adminSession.state === "unauthenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (adminSession.state === "forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const rangeParam = (searchParams.get("range") || "24h").toLowerCase();
    const interval = RANGE_TO_INTERVAL[rangeParam] || RANGE_TO_INTERVAL["30d"];

    const limitParam = Number(searchParams.get("limit") || "30");
    const offsetParam = Number(searchParams.get("offset") || "0");
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(Math.trunc(limitParam), 1), 100)
      : 30;
    const offset = Number.isFinite(offsetParam)
      ? Math.max(Math.trunc(offsetParam), 0)
      : 0;

    const countResult = await pool.query<{ total: string }>(
      `
      SELECT COUNT(*)::text AS total
      FROM orders o
      JOIN stock_market_courses smc ON smc.course_id = o.item_id
      WHERE smc.is_live = true
        AND o.created_at >= NOW() - $1::interval
      `,
      [interval],
    );
    const total = Number(countResult.rows[0]?.total || 0);

    const result = await pool.query<LiveClassBookingRow>(
      `
      SELECT
        o.id AS order_id,
        o.status AS order_status,
        o.created_at::text AS created_at,
        o.updated_at::text AS updated_at,
        u.id AS user_id,
        u.name AS customer_name,
        u.email AS customer_email,
        u.phone AS customer_phone,
        smc.course_id,
        smc.title AS course_title,
        o.total_amount,
        o.discount_amount,
        o.payable_amount,
        o.currency,
        po.gateway,
        po.gateway_order_id,
        po.status AS payment_status,
        p.gateway_payment_id,
        p.method AS payment_method,
        p.captured AS payment_captured,
        n_email.status AS email_notification_status,
        n_email.attempt_count AS email_notification_attempt_count,
        n_email.last_attempt_at::text AS email_notification_last_attempt_at,
        n_email.error_message AS email_notification_error,
        n_whatsapp.status AS whatsapp_notification_status,
        n_whatsapp.attempt_count AS whatsapp_notification_attempt_count,
        n_whatsapp.last_attempt_at::text AS whatsapp_notification_last_attempt_at,
        n_whatsapp.error_message AS whatsapp_notification_error
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN stock_market_courses smc ON smc.course_id = o.item_id
      LEFT JOIN LATERAL (
        SELECT
          po.gateway,
          po.gateway_order_id,
          po.status
        FROM payment_orders po
        WHERE po.order_id = o.id
        ORDER BY po.created_at DESC
        LIMIT 1
      ) po ON true
      LEFT JOIN LATERAL (
        SELECT
          p.gateway_payment_id,
          p.method,
          p.captured
        FROM payments p
        WHERE p.order_id = o.id
        ORDER BY p.created_at DESC
        LIMIT 1
      ) p ON true
      LEFT JOIN order_notifications n_email
        ON n_email.order_id = o.id
        AND n_email.type = 'ORDER_CONFIRMATION'
        AND n_email.channel = 'EMAIL'
      LEFT JOIN order_notifications n_whatsapp
        ON n_whatsapp.order_id = o.id
        AND n_whatsapp.type = 'ORDER_CONFIRMATION'
        AND n_whatsapp.channel = 'WHATSAPP'
      WHERE smc.is_live = true
        AND o.created_at >= NOW() - $1::interval
      ORDER BY o.created_at DESC
      LIMIT $2
      OFFSET $3
      `,
      [interval, limit, offset],
    );

    return NextResponse.json({
      bookings: result.rows,
      count: result.rowCount ?? result.rows.length,
      total,
      range: rangeParam in RANGE_TO_INTERVAL ? rangeParam : "24h",
      limit,
      offset,
    });
  } catch (error) {
    console.error("[ADMIN_LIVE_CLASS_BOOKINGS] Failed to fetch bookings", error);
    return NextResponse.json(
      { error: "Failed to load live class bookings" },
      { status: 500 },
    );
  }
}

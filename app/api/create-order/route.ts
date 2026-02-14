import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import {
  LIVE_TRADING_CLASS_ITEM_ID,
  LIVE_TRADING_CLASS_PRICE_INR,
} from "@/lib/constants";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  let businessOrderId: number | null = null;
  let requestUserId: number | null = null;
  let requestAmount: number | null = null;

  try {
    console.log("[CREATE_ORDER] Parsing request body");
    const { amount, userId, itemId } = (await request.json()) as {
      amount: number;
      userId: number;
      itemId: number;
    };
    console.log("[CREATE_ORDER] Request body parsed", {
      hasAmount: Number.isFinite(amount),
      hasUserId: Number.isFinite(userId),
      hasItemId: Number.isFinite(itemId),
    });

    const pricingByItemId: Record<number, number> = {
      [LIVE_TRADING_CLASS_ITEM_ID]: LIVE_TRADING_CLASS_PRICE_INR * 100,
    };
    const resolvedAmount = pricingByItemId[itemId];

    if (!Number.isFinite(resolvedAmount)) {
      console.warn("[CREATE_ORDER] Unsupported item", { itemId });
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    console.log("[CREATE_ORDER] Creating DB order");
    const { orderId, err } = await createBusinessOrder(
      userId,
      resolvedAmount,
      itemId,
    );

    if (err) {
      console.error("[CREATE_ORDER] Database error:", err);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    console.log("[CREATE_ORDER] Building Razorpay options", { orderId });
    businessOrderId = orderId;
    requestUserId = userId;
    requestAmount = resolvedAmount;
    var options = {
      amount: resolvedAmount,
      currency: "INR",
      receipt: orderId.toString() + "_" + userId.toString(),
    };
    console.log("[CREATE_ORDER] Razorpay options ready", options);
  } catch (error) {
    console.error("[CREATE_ORDER] Invalid request body:", error);
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      { status: 400 },
    );
  }

  try {
    if (!options || businessOrderId === null) {
      console.error("[CREATE_ORDER] Missing Razorpay options or order id");
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }
    if (requestUserId === null || requestAmount === null) {
      console.error("[CREATE_ORDER] Missing user or amount for gateway order");
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    console.log("[CREATE_ORDER] Sending order to Razorpay");
    console.log("[CREATE_ORDER] Creating order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("[CREATE_ORDER] Order created:", order, options);

    const { err } = await createGatewayOrder(
      businessOrderId,
      requestAmount,
      options.currency,
      requestUserId,
      order.id,
    );
    if (err) {
      console.error("[CREATE_ORDER] gateway_orders insert failed:", err);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    console.log("[CREATE_ORDER] Responding with order id");
    return NextResponse.json(
      { orderId: order.id, bookingId: businessOrderId },
      { status: 200 },
    );
  } catch (error) {
    (console.error("[CREATE_ORDER] Razorpay error:", error), options);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}

async function createBusinessOrder(
  userID: number,
  amount: number,
  itemID: number,
): Promise<{ orderId: number; err: string | null }> {
  try {
    console.log("[CREATE_BUSINESS_ORDER] Preparing DB insert", {
      userID,
      amount,
      itemID,
    });
    const result = await pool.query<{ id: number }>(
      `INSERT INTO orders (
        user_id,
        total_amount,
        discount_amount,
        payable_amount,
        item_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [userID, amount, 0, amount, itemID, "CREATED"],
    );

    const orderId = result.rows[0]?.id;
    console.log("[CREATE_BUSINESS_ORDER] DB insert completed", { orderId });
    if (!orderId) {
      return { orderId: 0, err: "Failed to create order" };
    }

    return { orderId, err: null };
  } catch (error) {
    console.error("[CREATE_BUSINESS_ORDER] Insert error:", error);
    return { orderId: 0, err: "Failed to create order" };
  }
}

async function createGatewayOrder(
  orderId: number,
  amount: number,
  currency: string,
  userId: number,
  gatewayOrderId: string,
): Promise<{ paymentOrderId: number; err: string | null }> {
  try {
    console.log("[CREATE_GATEWAY_ORDER] Preparing DB insert", {
      orderId,
      userId,
      amount,
      currency,
      gatewayOrderId,
    });

    const result = await pool.query<{ id: number }>(
      `INSERT INTO payment_orders (
        order_id,
        user_id,
        gateway,
        gateway_order_id,
        amount,
        currency,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [
        orderId,
        userId,
        "RAZORPAY",
        gatewayOrderId,
        amount,
        currency,
        "CREATED",
      ],
    );

    const paymentOrderId = result.rows[0]?.id;
    console.log("[CREATE_GATEWAY_ORDER] DB insert completed", {
      paymentOrderId,
    });
    if (!paymentOrderId) {
      return { paymentOrderId: 0, err: "Failed to create payment order" };
    }

    return { paymentOrderId, err: null };
  } catch (error) {
    console.error("[CREATE_GATEWAY_ORDER] Insert error:", error);
    return { paymentOrderId: 0, err: "Failed to create payment order" };
  }
}

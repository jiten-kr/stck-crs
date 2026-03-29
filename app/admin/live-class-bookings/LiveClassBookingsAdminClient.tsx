"use client";

import { useEffect, useMemo, useState } from "react";

type LiveClassBooking = {
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

type ApiResponse = {
  bookings: LiveClassBooking[];
  count: number;
  total: number;
  range: string;
  limit: number;
  offset: number;
};

const PAGE_SIZE = 30;
const RANGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "1h", label: "Last 1H" },
  { value: "6h", label: "Last 6H" },
  { value: "12h", label: "Last 12H" },
  { value: "24h", label: "Last 24H" },
  { value: "2d", label: "Last 2 Days" },
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "30d", label: "Last 30 Days" },
];

function formatMoney(amountInPaise: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 2,
  }).format((amountInPaise || 0) / 100);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN");
}

function statusClass(status: string | null): string {
  switch (status) {
    case "SENT":
    case "PAID":
    case "captured":
      return "bg-green-100 text-green-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "PENDING":
    case "CREATED":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function StatusPill({ status }: { status: string | null }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusClass(status)}`}
    >
      {status || "N/A"}
    </span>
  );
}

function notificationBoxClass(status: string | null): string {
  return status === "SENT"
    ? "rounded border border-green-200 bg-green-50 p-2 text-black"
    : "rounded border border-red-200 bg-red-50 p-2 text-black";
}

export default function LiveClassBookingsAdminClient() {
  const [bookings, setBookings] = useState<LiveClassBooking[]>([]);
  const [selectedRange, setSelectedRange] = useState("24h");
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async ({
    range,
    offset,
    append,
  }: {
    range: string;
    offset: number;
    append: boolean;
  }) => {
    setError(null);
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        range,
        limit: String(PAGE_SIZE),
        offset: String(offset),
      });
      const res = await fetch(`/api/admin/live-class-bookings?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Failed to load bookings");
      }

      const data = (await res.json()) as ApiResponse;
      setTotalRecords(data.total || 0);
      setBookings((prev) =>
        append ? [...prev, ...(data.bookings || [])] : data.bookings || [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadBookings({ range: selectedRange, offset: 0, append: false });
  }, [selectedRange]);

  const hasMore = bookings.length < totalRecords;

  const summary = useMemo(() => {
    const total = bookings.length;
    const paid = bookings.filter((b) => b.order_status === "PAID").length;
    const emailSent = bookings.filter(
      (b) => b.email_notification_status === "SENT",
    ).length;
    const whatsappSent = bookings.filter(
      (b) => b.whatsapp_notification_status === "SENT",
    ).length;
    return { total, paid, emailSent, whatsappSent };
  }, [bookings]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading bookings...</p>;
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          className="rounded border px-3 py-1.5 text-sm hover:bg-muted"
          onClick={() =>
            loadBookings({ range: selectedRange, offset: 0, append: false })
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="time-range" className="text-sm font-medium">
            Time Range
          </label>
          <select
            id="time-range"
            className="rounded border bg-background px-2 py-1.5 text-sm"
            value={selectedRange}
            onChange={(event) => setSelectedRange(event.target.value)}
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing {bookings.length} of {totalRecords} records
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded border p-3 text-sm">
          <p className="text-muted-foreground">Loaded Bookings</p>
          <p className="text-xl font-semibold">{summary.total}</p>
        </div>
        <div className="rounded border p-3 text-sm">
          <p className="text-muted-foreground">Available (Range)</p>
          <p className="text-xl font-semibold">{totalRecords}</p>
        </div>
        <div className="rounded border p-3 text-sm">
          <p className="text-muted-foreground">Paid Orders</p>
          <p className="text-xl font-semibold">{summary.paid}</p>
        </div>
        <div className="rounded border p-3 text-sm">
          <p className="text-muted-foreground">Email Sent</p>
          <p className="text-xl font-semibold">{summary.emailSent}</p>
        </div>
        <div className="rounded border p-3 text-sm">
          <p className="text-muted-foreground">WhatsApp Sent</p>
          <p className="text-xl font-semibold">{summary.whatsappSent}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full min-w-[1300px] text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 font-medium">Order</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Course</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Payment</th>
              <th className="px-3 py-2 font-medium">Email Notification</th>
              <th className="px-3 py-2 font-medium">WhatsApp Notification</th>
              <th className="px-3 py-2 font-medium">Timestamps</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-muted-foreground" colSpan={8}>
                  No live class bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.order_id} className="border-t align-top">
                  <td className="space-y-1 px-3 py-3">
                    <p className="font-medium">#{booking.order_id}</p>
                    <div className="mt-1">
                      <StatusPill status={booking.order_status} />
                    </div>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <p className="font-medium">{booking.customer_name}</p>
                    <p className="text-muted-foreground">{booking.customer_email}</p>
                    <p className="text-muted-foreground">
                      {booking.customer_phone || "-"}
                    </p>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <p className="font-medium">{booking.course_title}</p>
                    <p className="text-muted-foreground">Course ID: {booking.course_id}</p>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <p>Total: {formatMoney(booking.total_amount, booking.currency)}</p>
                    <p>Discount: {formatMoney(booking.discount_amount, booking.currency)}</p>
                    <p className="font-medium">
                      Payable: {formatMoney(booking.payable_amount, booking.currency)}
                    </p>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <p>Gateway: {booking.gateway || "-"}</p>
                    <p>Order ID: {booking.gateway_order_id || "-"}</p>
                    <p>Payment ID: {booking.gateway_payment_id || "-"}</p>
                    <p>Method: {booking.payment_method || "-"}</p>
                    <p>Captured: {booking.payment_captured ? "Yes" : "No"}</p>
                    <div className="mt-1">
                      <StatusPill status={booking.payment_status} />
                    </div>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <div
                      className={notificationBoxClass(
                        booking.email_notification_status,
                      )}
                    >
                      <div className="mb-1">
                        <StatusPill status={booking.email_notification_status} />
                      </div>
                      <p>
                        Attempts: {booking.email_notification_attempt_count ?? 0}
                      </p>
                      <p>
                        Last Try:{" "}
                        {formatDate(booking.email_notification_last_attempt_at)}
                      </p>
                      {booking.email_notification_error ? (
                        <p className="mt-1 text-xs text-red-600">
                          Error: {booking.email_notification_error}
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <div
                      className={notificationBoxClass(
                        booking.whatsapp_notification_status,
                      )}
                    >
                      <div className="mb-1">
                        <StatusPill status={booking.whatsapp_notification_status} />
                      </div>
                      <p>
                        Attempts: {booking.whatsapp_notification_attempt_count ?? 0}
                      </p>
                      <p>
                        Last Try:{" "}
                        {formatDate(booking.whatsapp_notification_last_attempt_at)}
                      </p>
                      {booking.whatsapp_notification_error ? (
                        <p className="mt-1 text-xs text-red-600">
                          Error: {booking.whatsapp_notification_error}
                        </p>
                      ) : null}
                    </div>
                  </td>
                  <td className="space-y-1 px-3 py-3">
                    <p>Created: {formatDate(booking.created_at)}</p>
                    <p>Updated: {formatDate(booking.updated_at)}</p>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {bookings.length} of {totalRecords}
        </p>
        {hasMore ? (
          <button
            type="button"
            className="rounded border px-3 py-1.5 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loadingMore}
            onClick={() =>
              loadBookings({
                range: selectedRange,
                offset: bookings.length,
                append: true,
              })
            }
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">
            You have reached the end.
          </span>
        )}
      </div>
    </div>
  );
}

import pool from "@/lib/db";

export async function GET(req: Request) {
  console.info("[REPROCESS_RAZORPAY_WEBHOOK] Cron job started");
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    console.error("[REPROCESS_RAZORPAY_WEBHOOK] Unauthorized request");
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await pool.query(
    `
    SELECT id, event_id, event_type, payload
    FROM payment_webhook_events
    WHERE processed = false
      AND event_type IN ('payment.captured', 'payment.failed')
    ORDER BY received_at
    LIMIT 10
    `,
  );

  console.info(
    `[REPROCESS_RAZORPAY_WEBHOOK] Found ${result.rowCount} unprocessed events`,
  );

  for (const row of result.rows) {
    const { id, event_id, event_type, payload } = row;
    console.info(
      `[REPROCESS_RAZORPAY_WEBHOOK] Processing event '${event_id}' of type '${event_type}'`,
      { event_id, event_type },
    );
    console.debug("[REPROCESS_RAZORPAY_WEBHOOK] Event payload", {
      event_id,
      payload,
      row,
    });

    try {
      // const data = JSON.parse(payload);
      const payment = payload?.payload?.payment?.entity;

      if (!payment) {
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] No payment entity found in payload",
          { event_id },
        );
        continue;
      }

      const gatewayOrderId = payment?.order_id;
      const gatewayPaymentId = payment?.id;

      if (!gatewayOrderId || !gatewayPaymentId) {
        console.warn(
          "[REPROCESS_RAZORPAY_WEBHOOK] Missing gatewayOrderId or gatewayPaymentId",
          { event_id, gatewayOrderId, gatewayPaymentId },
        );
        continue;
      }

      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        const poRes = await client.query(
          `
          SELECT id, order_id
          FROM payment_orders
          WHERE gateway = 'RAZORPAY'
            AND gateway_order_id = $1
          LIMIT 1
          `,
          [gatewayOrderId],
        );

        if (!poRes.rows[0]) {
          await client.query("ROLLBACK");
          console.warn(
            "[REPROCESS_RAZORPAY_WEBHOOK] No payment order found for gatewayOrderId",
            { event_id, gatewayOrderId },
          );
          continue;
        }

        const paymentOrder = poRes.rows[0];

        console.info("[REPROCESS_RAZORPAY_WEBHOOK] Inserting payment record", {
          event_id,
          gatewayPaymentId,
        });
        await client.query(
          `
          INSERT INTO payments (
            order_id,
            payment_order_id,
            gateway,
            gateway_payment_id,
            amount,
            currency,
            method,
            status,
            captured
          )
          VALUES ($1,$2,'RAZORPAY',$3,$4,$5,$6,$7,true)
          ON CONFLICT (gateway, gateway_payment_id) DO NOTHING
          `,
          [
            paymentOrder.order_id,
            paymentOrder.id,
            gatewayPaymentId,
            payment.amount,
            payment.currency,
            payment.method,
            payment.status,
          ],
        );

        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Updating order status to PAID",
          {
            event_id,
            gatewayOrderId,
            gatewayPaymentId,
          },
        );
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Updating payment_orders status to PAID",
          { event_id, gatewayOrderId, gatewayPaymentId },
        );
        await client.query(
          `UPDATE payment_orders SET status = 'PAID' WHERE id = $1`,
          [paymentOrder.id],
        );

        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Updating orders status to PAID",
          { event_id, gatewayOrderId, gatewayPaymentId },
        );
        await client.query(`UPDATE orders SET status = 'PAID' WHERE id = $1`, [
          paymentOrder.order_id,
        ]);

        console.info("[REPROCESS_RAZORPAY_WEBHOOK] Committing transaction", {
          event_id,
          gatewayOrderId,
          gatewayPaymentId,
        });
        await client.query("COMMIT");
        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Transaction committed successfully",
          { event_id, gatewayOrderId, gatewayPaymentId },
        );

        console.info(
          "[REPROCESS_RAZORPAY_WEBHOOK] Marking event as processed",
          { event_id, gatewayOrderId, gatewayPaymentId },
        );
        await pool.query(
          `
          UPDATE payment_webhook_events
          SET processed = true
          WHERE id = $1
          `,
          [id],
        );
        console.info("[REPROCESS_RAZORPAY_WEBHOOK] Event marked as processed", {
          event_id,
          gatewayOrderId,
          gatewayPaymentId,
        });
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(
          "[REPROCESS_RAZORPAY_WEBHOOK] Error processing event, transaction rolled back",
          { event_id, error: err },
        );
      } finally {
        client.release();
      }
    } catch (err) {
      // bad payload, skip
      console.error(
        "[REPROCESS_RAZORPAY_WEBHOOK] Error processing webhook event",
        { event_id, error: err },
      );
    }
  }

  return new Response("OK");
}

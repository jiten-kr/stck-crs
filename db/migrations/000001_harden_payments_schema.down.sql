
-- +migrate Down
BEGIN;

-- ===============================
-- DROP INDEXES
-- ===============================

DROP INDEX IF EXISTS idx_payments_gateway_payment_id;
DROP INDEX IF EXISTS idx_payment_orders_gateway_order_id;
DROP INDEX IF EXISTS idx_orders_user_id;

-- ===============================
-- DROP CHECK CONSTRAINTS
-- ===============================

ALTER TABLE payments
DROP CONSTRAINT IF EXISTS chk_payments_status;

ALTER TABLE payment_orders
DROP CONSTRAINT IF EXISTS chk_payment_orders_status;

ALTER TABLE orders
DROP CONSTRAINT IF EXISTS chk_orders_status;

-- ===============================
-- DROP FOREIGN KEYS
-- ===============================

ALTER TABLE payments
DROP CONSTRAINT IF EXISTS fk_payments_payment_order;

ALTER TABLE payments
DROP CONSTRAINT IF EXISTS fk_payments_order;

ALTER TABLE orders
DROP CONSTRAINT IF EXISTS fk_orders_user;

COMMIT;
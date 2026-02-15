-- +migrate Up
BEGIN;

-- ===============================
-- 1️⃣ FOREIGN KEYS
-- ===============================

ALTER TABLE orders
ADD CONSTRAINT fk_orders_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

ALTER TABLE payments
ADD CONSTRAINT fk_payments_order
FOREIGN KEY (order_id)
REFERENCES orders(id)
ON DELETE CASCADE;

ALTER TABLE payments
ADD CONSTRAINT fk_payments_payment_order
FOREIGN KEY (payment_order_id)
REFERENCES payment_orders(id)
ON DELETE CASCADE;


-- ===============================
-- 2️⃣ CHECK CONSTRAINTS
-- ===============================

ALTER TABLE orders
ADD CONSTRAINT chk_orders_status
CHECK (status IN ('CREATED', 'PAID', 'PARTIALLY_PAID', 'CANCELLED'));

ALTER TABLE payment_orders
ADD CONSTRAINT chk_payment_orders_status
CHECK (status IN ('CREATED', 'ATTEMPTED', 'PAID', 'FAILED'));

ALTER TABLE payments
ADD CONSTRAINT chk_payments_status
CHECK (status IN ('authorized', 'captured', 'failed'));


-- ===============================
-- 3️⃣ INDEXES
-- ===============================

CREATE INDEX idx_payments_gateway_payment_id
ON payments(gateway_payment_id);

CREATE INDEX idx_payment_orders_gateway_order_id
ON payment_orders(gateway_order_id);

CREATE INDEX idx_orders_user_id
ON orders(user_id);

COMMIT;




-- +migrate Up
BEGIN;

-- ===============================
-- 1️⃣ CREATE ENUMS
-- ===============================

CREATE TYPE notification_channel AS ENUM (
    'EMAIL',
    'WHATSAPP'
);

CREATE TYPE notification_status AS ENUM (
    'PENDING',
    'SENT',
    'FAILED'
);

CREATE TYPE notification_type AS ENUM (
    'ORDER_CONFIRMATION',
    'PAYMENT_RECEIPT'
);

-- ===============================
-- 2️⃣ CREATE TABLE
-- ===============================

CREATE TABLE order_notifications (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    type notification_type NOT NULL,
    channel notification_channel NOT NULL,

    recipient VARCHAR(255) NOT NULL,
    subject TEXT,

    status notification_status NOT NULL DEFAULT 'PENDING',

    attempt_count INT NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,

    error_message TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_order_notification UNIQUE (order_id, type, channel)
);

-- ===============================
-- 3️⃣ INDEX FOR CRON PERFORMANCE
-- ===============================

CREATE INDEX idx_order_notifications_status
ON order_notifications(status);

CREATE INDEX idx_order_notifications_order_id
ON order_notifications(order_id);

COMMIT;

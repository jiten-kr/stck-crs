-- +migrate Down
BEGIN;

-- ===============================
-- 1️⃣ DROP TABLE
-- ===============================

DROP TABLE IF EXISTS order_notifications;

-- ===============================
-- 2️⃣ DROP ENUMS
-- ===============================

DROP TYPE IF EXISTS notification_type;
DROP TYPE IF EXISTS notification_status;
DROP TYPE IF EXISTS notification_channel;

COMMIT;

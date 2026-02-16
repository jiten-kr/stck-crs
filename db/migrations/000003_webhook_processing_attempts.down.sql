-- +migrate Down
ALTER TABLE payment_webhook_events
DROP COLUMN IF EXISTS processing_attempts;

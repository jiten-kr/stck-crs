-- +migrate Up
ALTER TABLE payment_webhook_events
ADD COLUMN IF NOT EXISTS processing_attempts INT NOT NULL DEFAULT 0;

COMMENT ON COLUMN payment_webhook_events.processing_attempts IS 'Incremented on each processing attempt (e.g. no payment order, or error). Event is marked processed (dead-letter) after max attempts.';

-- Remove promo_config table
DROP INDEX IF EXISTS idx_promo_config_enabled;
DROP INDEX IF EXISTS idx_promo_config_course_id;
DROP TABLE IF EXISTS promo_config;

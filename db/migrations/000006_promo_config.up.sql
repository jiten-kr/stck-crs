-- Promo/countdown configuration table
-- Used to control promotional countdown banners on the site
-- Only shows countdown when enabled AND countdown_end_at is in the future
CREATE TABLE IF NOT EXISTS promo_config (
    id SERIAL PRIMARY KEY,
    
    -- Optional course-specific promo (NULL = site-wide)
    course_id INT REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    
    -- Countdown settings
    countdown_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    countdown_end_at TIMESTAMP WITH TIME ZONE,  -- Real end time (must be in future to show)
    
    -- Banner display text
    promo_text TEXT DEFAULT 'Special introductory price — offer ends soon',
    
    -- Audit timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Only one promo config per course (NULL course_id = site-wide, only one allowed)
    CONSTRAINT uq_promo_config_course UNIQUE (course_id)
);

-- Index for quick lookups
CREATE INDEX idx_promo_config_course_id ON promo_config(course_id);
CREATE INDEX idx_promo_config_enabled ON promo_config(countdown_enabled) WHERE countdown_enabled = TRUE;

-- Insert default site-wide config (countdown disabled by default)
INSERT INTO promo_config (course_id, countdown_enabled, countdown_end_at, promo_text)
VALUES (NULL, FALSE, NULL, 'Special introductory price — offer ends soon')
ON CONFLICT DO NOTHING;

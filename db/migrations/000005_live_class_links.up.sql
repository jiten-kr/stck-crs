-- Live class meeting URL and WhatsApp community link per course
CREATE TABLE live_class_links (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    live_class_url TEXT,
    whatsapp_group_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_live_class_links_course UNIQUE (course_id)
);

CREATE INDEX idx_live_class_links_course_id ON live_class_links(course_id);

-- Users table (with role support)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for courses (reference instructor as user_id)
CREATE TABLE IF NOT EXISTS stock_market_courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Useful flags
    is_active BOOLEAN DEFAULT TRUE
);
ALTER TABLE stock_market_courses ADD COLUMN is_live BOOLEAN NOT NULL DEFAULT FALSE;


-- What you will learn (pointers)
CREATE TABLE IF NOT EXISTS course_learnings (
    learning_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    pointer_text TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modules (sections in a course)
CREATE TABLE IF NOT EXISTS course_modules (
    module_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons (videos/content inside a module)
CREATE TABLE IF NOT EXISTS course_lessons (
    lesson_id SERIAL PRIMARY KEY,
    module_id INT NOT NULL REFERENCES course_modules(module_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTERVAL,
    display_order INT NOT NULL DEFAULT 1,

    -- Mux integration for lessons
    mux_asset_id VARCHAR(100) UNIQUE,
    mux_playback_id VARCHAR(100) UNIQUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress tracking per lesson
CREATE TABLE IF NOT EXISTS lesson_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, -- assuming users table exists
    lesson_id INT NOT NULL REFERENCES course_lessons(lesson_id) ON DELETE CASCADE,

    watched_duration INTERVAL DEFAULT '0', -- e.g., '00:02:00'
    completed BOOLEAN DEFAULT FALSE, -- true if lesson fully watched
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one progress record per user per lesson
    CONSTRAINT uq_user_lesson UNIQUE (user_id, lesson_id)
);

-- User enrollments
CREATE TABLE IF NOT EXISTS user_enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress JSONB DEFAULT '{}'::jsonb, -- flexible progress tracking
    UNIQUE(user_id, course_id)
);

-- Course ratings and reviews
CREATE TABLE IF NOT EXISTS course_ratings (
    rating_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    user_id INT NOT NULL, -- assuming you have a users table
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5) NOT NULL, -- 1 to 5 stars
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Ensure a user can rate a course only once
    CONSTRAINT uq_course_user UNIQUE (course_id, user_id)
);

CREATE TABLE IF NOT EXISTS  password_reset_codes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 6-digit code (keep as text for leading zeros)
  code VARCHAR(6) NOT NULL,

  -- Automatically expires 15 minutes after insert
  expires_at TIMESTAMP WITH TIME ZONE 
    DEFAULT (NOW() + INTERVAL '15 minutes') NOT NULL,

  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_active_reset_per_user UNIQUE (user_id)
);


-- Orders table to track purchases (linked to users and courses)    

CREATE TABLE IF NOT EXISTS  orders (
    id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',

    total_amount INT NOT NULL,        -- in paise
    discount_amount INT DEFAULT 0,
    payable_amount INT NOT NULL,      -- final amount

    item_id BIGINT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,  -- course_id or live_class_id


    status VARCHAR(30) NOT NULL,      -- CREATED, PAID, PARTIALLY_PAID, CANCELLED

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS  payment_orders (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    gateway VARCHAR(20) NOT NULL,       -- RAZORPAY
    gateway_order_id VARCHAR(100) NOT NULL,

    amount INT NOT NULL,
    currency VARCHAR(10) NOT NULL,

    status VARCHAR(30) NOT NULL,        -- CREATED, ATTEMPTED, PAID, FAILED

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(gateway, gateway_order_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,

    order_id BIGINT NOT NULL,
    payment_order_id BIGINT NOT NULL,

    gateway VARCHAR(20) NOT NULL,          -- RAZORPAY
    gateway_payment_id VARCHAR(100) NOT NULL,

    amount INT NOT NULL,
    currency VARCHAR(10) NOT NULL,

    method VARCHAR(30),                    -- card, upi, netbanking
    status VARCHAR(30) NOT NULL,           -- authorized, captured, failed

    captured BOOLEAN DEFAULT FALSE,

    error_code VARCHAR(50),
    error_description TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(gateway, gateway_payment_id)
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
    id BIGSERIAL PRIMARY KEY,

    gateway VARCHAR(20) NOT NULL,
    event_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,

    payload JSONB NOT NULL,

    processed BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(gateway, event_id)
);







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
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Useful flags
    is_active BOOLEAN DEFAULT TRUE
);

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

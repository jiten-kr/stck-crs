-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE stock_market_courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor VARCHAR(150) NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    duration INTERVAL, -- e.g., '2 hours 30 minutes'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Mux integration (at course level if single video course)
    mux_asset_id VARCHAR(100) UNIQUE,
    mux_playback_id VARCHAR(100) UNIQUE
);

-- What you will learn (pointers)
CREATE TABLE course_learnings (
    learning_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    pointer_text TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modules (sections in a course)
CREATE TABLE course_modules (
    module_id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons (videos/content inside a module)
CREATE TABLE course_lessons (
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

-- User enrollments
CREATE TABLE user_enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES stock_market_courses(course_id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress JSONB DEFAULT '{}'::jsonb, -- flexible progress tracking
    UNIQUE(user_id, course_id)
);

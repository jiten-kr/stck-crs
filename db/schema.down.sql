-- Drop course_ratings first (depends on stock_market_courses and users)
DROP TABLE IF EXISTS course_ratings;

-- Drop user_enrollments (depends on users and stock_market_courses)
DROP TABLE IF EXISTS user_enrollments;

-- Drop lesson_progress (depends on course_lessons and users)
DROP TABLE IF EXISTS lesson_progress;

-- Drop course_lessons (depends on course_modules)
DROP TABLE IF EXISTS course_lessons;

-- Drop course_modules (depends on stock_market_courses)
DROP TABLE IF EXISTS course_modules;

-- Drop course_learnings (depends on stock_market_courses)
DROP TABLE IF EXISTS course_learnings;

-- Drop stock_market_courses (depends on nothing, but referenced by others)
DROP TABLE IF EXISTS stock_market_courses;

-- Drop users last (referenced by enrollments, ratings, progress)
DROP TABLE IF EXISTS users;

-- Drop password_reset_codes (depends on users)
DROP TABLE IF EXISTS password_reset_codes;


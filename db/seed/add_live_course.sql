-- Live course: Real-World Market Training
-- Requires users.id = 1 (instructor) to exist.

INSERT INTO stock_market_courses (
  title,
  description,
  instructor_id,
  price,
  is_active,
  is_live
)
VALUES (
  'Real-World Market Training',
  'Learn how the market really works — with practical strategies, real-world examples, and a clear system to trade and invest with confidence.',
  1,
  1999.00,
  TRUE,
  TRUE
)
RETURNING course_id, title;

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,

    -- Reviewer info
    name VARCHAR(100) NOT NULL,

    -- Review content
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,

    -- Trust / moderation
    verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- Review date (as shown to users)
    date DATE NOT NULL,

    -- Metadata (backend use)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

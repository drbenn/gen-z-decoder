DB_NAME="genz_translator"
DB_USER="postgres"
DB_PASSWORD="pass"

# SQL commands
# Set the password for the session
export PGPASSWORD=$DB_PASSWORD

psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"


psql -U $DB_USER -d $DB_NAME -c "
CREATE TABLE \"users\" (
    device_id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW(),
    premium_status BOOLEAN DEFAULT FALSE,
    total_translations INTEGER DEFAULT 0
);

-- Index for performance
CREATE INDEX idx_users_last_active ON users(last_active);
CREATE INDEX idx_users_premium_status ON users(premium_status);

-- ============================================
-- DAILY USAGE TABLE  
-- ============================================
-- Track daily translation counts (privacy-first - no content stored)
CREATE TABLE \"daily_usage\" (
    id UUID PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    translation_count INTEGER DEFAULT 0,
    mode_gen_to_english INTEGER DEFAULT 0,
    mode_english_to_gen INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_daily_usage_device FOREIGN KEY (device_id) REFERENCES users(device_id) ON DELETE CASCADE,
    CONSTRAINT unique_device_date UNIQUE(device_id, date)
);

-- Indexes for performance
CREATE INDEX idx_daily_usage_device_id ON daily_usage(device_id);
CREATE INDEX idx_daily_usage_date ON daily_usage(date);
CREATE INDEX idx_daily_usage_device_date ON daily_usage(device_id, date);

-- ============================================
-- PURCHASES TABLE
-- ============================================
-- Google Play IAP tracking (cross-device premium)
CREATE TABLE \"purchases\" (
    id UUID PRIMARY KEY,
    google_order_id TEXT UNIQUE NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE,
    device_id VARCHAR(255), -- Optional - links to device that made purchase
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_purchases_device FOREIGN KEY (device_id) REFERENCES users(device_id) ON DELETE SET NULL
);

-- Indexes for performance  
CREATE INDEX idx_purchases_google_order_id ON purchases(google_order_id);
CREATE INDEX idx_purchases_verified ON purchases(verified);
CREATE INDEX idx_purchases_device_id ON purchases(device_id);

-- ============================================
-- DICTIONARY VERSIONS TABLE
-- ============================================
-- Track dictionary \"updates\" (monthly releases)
CREATE TABLE dictionary_versions (
    id UUID PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    release_date DATE NOT NULL,
    download_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Only one active version at a time
CREATE UNIQUE INDEX idx_dictionary_active ON dictionary_versions(is_active) WHERE is_active = true;
CREATE INDEX idx_dictionary_version ON dictionary_versions(version);

-- ============================================
-- ANALYTICS TABLE (Optional - Business Metrics)
-- ============================================
-- Track usage patterns for business insights (no personal content)
CREATE TABLE \"analytics_events\" (
    id UUID PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    device_id VARCHAR(255),
    event_data JSONB, -- Flexible for different event types
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_analytics_device FOREIGN KEY (device_id) REFERENCES users(device_id) ON DELETE SET NULL
);

-- Indexes for analytics queries
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_device_id ON analytics_events(device_id);

"
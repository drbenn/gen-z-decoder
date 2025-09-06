-- Gen Z Translator Database Setup Script
-- PostgreSQL Database Creation and Tables

-- ============================================
-- DATABASE CREATION
-- ============================================
-- Run this first as superuser:
-- CREATE DATABASE genz_translator;
-- Then connect to the genz_translator database and run the rest:

-- ============================================
-- USERS TABLE
-- ============================================
-- Device-based user tracking (no personal data)
CREATE TABLE users (
    device_id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    last_active TIMESTAMP DEFAULT NOW(),
    premium_status BOOLEAN DEFAULT FALSE,
    premium_upgraded_at TIMESTAMP,
    total_translations INTEGER DEFAULT 0
);

-- Index for performance
CREATE INDEX idx_users_last_active ON users(last_active);
CREATE INDEX idx_users_premium_status ON users(premium_status);

-- ============================================
-- DAILY USAGE TABLE  
-- ============================================
-- Track daily translation counts (privacy-first - no content stored)
CREATE TABLE daily_usage (
    id UUID PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    translation_count INTEGER DEFAULT 0,
    mode_genz_to_english INTEGER DEFAULT 0,
    mode_english_to_genz INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_daily_usage_device FOREIGN KEY (device_id) REFERENCES users(device_id) ON DELETE CASCADE,
    CONSTRAINT unique_device_date UNIQUE(device_id, date)
);

-- Indexes for performance
CREATE INDEX idx_daily_usage_device_id ON daily_usage(device_id);
CREATE INDEX idx_daily_usage_date ON daily_usage(date);
CREATE INDEX idx_daily_usage_device_date ON daily_usage(device_id, date);

-- ============================================
-- PURCHASES TABLE (Cross-Platform IAP Support)
-- ============================================
-- Supports both Google Play and Apple App Store purchases
CREATE TABLE purchases (
    id UUID PRIMARY KEY,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('google_play', 'app_store')),
    
    -- Google Play specific fields
    google_order_id TEXT,
    purchase_token VARCHAR(512),
    
    -- Apple App Store specific fields  
    transaction_id VARCHAR(255),
    original_transaction_id VARCHAR(255),
    app_store_receipt_data TEXT,
    
    -- Common fields
    product_id VARCHAR(100) NOT NULL,
    purchase_date TIMESTAMP DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE,
    device_id VARCHAR(255), -- Optional - links to device that made purchase
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT fk_purchases_device FOREIGN KEY (device_id) REFERENCES users(device_id) ON DELETE SET NULL,
    
    -- Platform-specific unique constraints
    CONSTRAINT unique_google_order UNIQUE(google_order_id) DEFERRABLE,
    CONSTRAINT unique_purchase_token UNIQUE(purchase_token) DEFERRABLE,
    CONSTRAINT unique_transaction_id UNIQUE(transaction_id) DEFERRABLE,
    
    -- Platform validation constraints
    CONSTRAINT google_play_required_fields 
        CHECK (platform != 'google_play' OR (google_order_id IS NOT NULL AND purchase_token IS NOT NULL)),
    CONSTRAINT app_store_required_fields 
        CHECK (platform != 'app_store' OR (transaction_id IS NOT NULL AND app_store_receipt_data IS NOT NULL))
);

-- Indexes for performance  
CREATE INDEX idx_purchases_platform ON purchases(platform);
CREATE INDEX idx_purchases_google_order_id ON purchases(google_order_id);
CREATE INDEX idx_purchases_purchase_token ON purchases(purchase_token);
CREATE INDEX idx_purchases_transaction_id ON purchases(transaction_id);
CREATE INDEX idx_purchases_verified ON purchases(verified);
CREATE INDEX idx_purchases_device_id ON purchases(device_id);

-- ============================================
-- DICTIONARY VERSIONS TABLE
-- ============================================
-- Track dictionary updates (monthly releases)
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
CREATE TABLE analytics_events (
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

-- ============================================
-- INITIAL DATA
-- ============================================
-- Insert initial dictionary version (placeholder)
-- INSERT INTO dictionary_versions (version, release_date, download_url, is_active)
-- VALUES ('1.0.0', CURRENT_DATE, 'https://api.sparkdart.com/dictionary/v1.json', true);

-- ============================================
-- CROSS-PLATFORM PURCHASE QUERIES
-- ============================================

-- Check premium status across platforms:
-- SELECT DISTINCT device_id FROM purchases WHERE verified = true;

-- Google Play purchases:
-- SELECT * FROM purchases WHERE platform = 'google_play' AND verified = true;

-- Apple App Store purchases:
-- SELECT * FROM purchases WHERE platform = 'app_store' AND verified = true;

-- Cross-device premium detection (same purchase used on multiple devices):
-- SELECT purchase_token, COUNT(DISTINCT device_id) as device_count 
-- FROM purchases WHERE platform = 'google_play' GROUP BY purchase_token HAVING COUNT(DISTINCT device_id) > 1;
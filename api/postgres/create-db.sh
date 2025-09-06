#!/bin/bash

DB_NAME="genz_translator"
DB_USER="postgres"
DB_PASSWORD="pass"

# Set the password for the session
export PGPASSWORD=$DB_PASSWORD

psql -U $DB_USER -c "DROP DATABASE IF EXISTS $DB_NAME;"
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;"

psql -U $DB_USER -d $DB_NAME -c "
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE \"users\" (
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
CREATE TABLE \"daily_usage\" (
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
CREATE TABLE \"purchases\" (
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
    device_id VARCHAR(255),
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
CREATE TABLE \"dictionary_versions\" (
    id UUID PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    release_date DATE NOT NULL,
    dictionary_content JSONB NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Only one active version at a time
CREATE UNIQUE INDEX idx_dictionary_active ON dictionary_versions(is_active) WHERE is_active = true;
CREATE INDEX idx_dictionary_version ON dictionary_versions(version);

-- ============================================
-- ANALYTICS TABLE
-- ============================================
CREATE TABLE \"analytics_events\" (
    id UUID PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    device_id VARCHAR(255),
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_analytics_device FOREIGN KEY (device_id) REFERENCES users(device_id) ON DELETE SET NULL
);

-- Indexes for analytics queries
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_device_id ON analytics_events(device_id);
"

echo "Database $DB_NAME created successfully with cross-platform IAP support!"
How IAP Actually Works:
Google Play Store → App → Verify Purchase → Your API

The Real Flow:

User buys premium in app
Google gives you a purchase token
Your app sends that token to your API
Your API verifies with Google that it's legit
Only then do you grant premium access

Why This Complexity:

Anti-fraud: Prevents fake premium claims
Refund handling: Google can revoke purchases
Multiple devices: Same Google account, different device IDs

The Real IAP Flow:
Google Play Account → Purchase History → Any Device with That Account

What Actually Happens:

User buys premium on Device A
User gets new phone (Device B)
Installs your app on Device B with same Google account
App calls getAvailablePurchases() on startup
Google returns all valid purchases for that account
App automatically restores premium status

The Device ID Problem:
You're right - device ID becomes useless for purchase tracking because:

New device = new device ID
Same Google account = same purchase
Your database thinks it's a new user

Better Approach:

CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  google_order_id TEXT UNIQUE, -- This persists across devices
  product_id VARCHAR(100),
  purchase_date TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE
);

-- Device tracking separate from purchase tracking
CREATE TABLE device_usage (
  device_id VARCHAR(255) PRIMARY KEY,
  current_google_order_id TEXT, -- Links to active purchase
  created_at TIMESTAMP,
  last_active TIMESTAMP
);

V1 Simplification:
For V1, you could skip the server-side purchase database entirely - just let the app handle IAP locally with Google's restoration system.




CREATE TABLE users (
  device_id VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP,
  last_active TIMESTAMP,
  premium_status BOOLEAN DEFAULT FALSE,
  total_translations INTEGER DEFAULT 0
);

CREATE TABLE daily_usage (
  id UUID PRIMARY KEY,
  device_id VARCHAR(255),
  date DATE,
  translation_count INTEGER,
  mode_gen_to_english INTEGER DEFAULT 0,
  mode_english_to_gen INTEGER DEFAULT 0,
  UNIQUE(device_id, date)
);

Store usage metrics, not content:

Track translation counts, timestamps, modes
Don't store actual text being translated
Gives you business insights without privacy headaches


CREATE TABLE dictionary_items (
  id TEXT PRIMARY KEY,
  term TEXT,
  definition TEXT, 
  example TEXT,
  is_favorite BOOLEAN DEFAULT 0,
  last_updated TEXT
);
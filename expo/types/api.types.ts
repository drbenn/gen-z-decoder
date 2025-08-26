import { TranslationMode } from './app.types';

// Translation API types
export interface TranslationRequest {
  text: string;
  mode: TranslationMode;
}

export interface TranslationResponse {
  input: string;
  output: string;
  mode: TranslationMode;
  timestamp: string;
}

// Usage tracking types
export interface UsageResponse {
  dailyCount: number;
  dailyLimit: number;
  isPremium: boolean;
  resetTime: string;
}

// Premium upgrade types
export interface PremiumUpgradeRequest {
  purchaseToken: string;
  obfuscatedAccountId?: string; // From Google Play if available
}

export interface PremiumUpgradeResponse {
  success: boolean;
  isPremium: boolean;
  newDailyLimit: number;
}

// Dictionary update types
export interface DictionaryVersionResponse {
  version: string;
  lastUpdated: string;
  downloadUrl: string;
}

export interface DictionaryDownloadResponse {
  id: string;
  term: string;
  definition: string;
  examples: string[];
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// You know it's really crazy to see like transition request and translation response without like a user id on it I feel like in a normal world i'd be tracking this except for I can't because you never know when someone could get a new phone therefore their phone ID would be different

// That's a really good point. In a normal API, you'd want to track who made what translation requests for analytics, abuse prevention, etc. But with their architecture where they're using device IDs and people change phones frequently, there's no persistent user identity to track against.

// Let me think about this:

//     Device ID changes when someone gets a new phone
//     They don't want to require user accounts/login
//     Google Play obfuscated IDs aren't reliable enough
//     So they can't really have a persistent user ID to track translations against

// The user is right - in a "normal world" you'd have a user ID on every request, but their privacy-first approach and the reality of people changing phones makes this tricky.

// They could:

//     Require Google sign-in (but that's friction)
//     Use some kind of anonymous but persistent ID (but how?)
//     Just accept that they can't track individual users long-term
//     Track at device level only (which is what they're doing)

// I think they're actually making the right trade-off here - prioritizing privacy and simplicity over detailed user tracking. The device ID in the header is probably sufficient for rate limiting and basic analytics.

// Exactly! You're hitting on a key trade-off with the privacy-first approach.

// In a "normal" app:

//     User signs up with email/Google
//     Every API call has userId: "user_12345"
//     Track everything forever across devices

// Your approach:

//     No user accounts (less friction, more privacy)
//     Device ID for rate limiting only
//     Accept that you lose user continuity when phones change

// The reality:

//     People get new phones every 1-3 years
//     Device ID resets = "new user" in your system
//     You can't build long-term user profiles or track usage patterns

// But honestly, for a Gen Z translator, that's probably fine:

//     Users don't need profiles or history syncing
//     Each translation is independent
//     Rate limiting per device is sufficient
//     Less data = less privacy concerns

// The only "tracking" you really need:

//     Device-level rate limiting (which you have)
//     Basic analytics (daily translation count, not per-user)
//     Premium status (which Google Play handles)

// You're trading detailed user analytics for simplicity and privacy. That's actually pretty smart for this type of app.
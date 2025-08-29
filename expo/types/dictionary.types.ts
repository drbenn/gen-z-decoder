export interface DictionaryVersionResponse {
  version: string
  releaseDate: string
  message: string
}

export interface DictionaryDownloadResponse {
  version: string
  release_date: string
  totalEntries: number
  entries: DictionaryEntry[]
}

export interface DictionaryEntry {
  id: string                    // UUID from database
  term: string                  // "no cap"
  pronunciation?: string        // "PEE-ree-id" for periodt, null if obvious
  definition: string            // "means 'no lie' or 'for real'"
  examples: string[]            // ["that pizza was fire no cap", "I'm going no cap"]
  category: SlangCategory       // COMMUNICATION
  sentiment: SlangSentiment     // NEUTRAL  
  contexts: UsageContext[]      // [TEXTING, CASUAL_CONVERSATION]
  popularity: number            // 1-10 scale (how common/trending)
  related_terms: string[]       // ["for real", "fr", "deadass"]
  last_updated: string          // ISO string
  is_favorite?: boolean
}

export enum SlangCategory {
  COMMUNICATION = 'communication',    // no cap, bet, say less
  DESCRIBING = 'describing',          // fire, bussin, mid, cringe  
  PEOPLE = 'people',                  // bestie, karen, simp
  ACTIONS = 'actions',                // slay, flex, ghosting
  REACTIONS = 'reactions',            // sheesh, mood, deceased
  INTERNET = 'internet'               // stan, main character, vibe check
}

export enum SlangSentiment {
  POSITIVE = 'positive',              // fire, bussin, slay
  NEGATIVE = 'negative',              // mid, trash, cringe
  NEUTRAL = 'neutral'                 // lowkey, tbh, ngl
}

export enum UsageContext {
  TEXTING = 'texting',                // ngl, fr, tbh
  SOCIAL_MEDIA = 'social_media',      // stan, main character
  CASUAL_CONVERSATION = 'casual',     // bestie, no cap
  DATING = 'dating',                  // rizz, simp
  FOOD = 'food'                       // bussin, slaps
}
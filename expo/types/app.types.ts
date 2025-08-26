export enum TranslationMode {
  TO_GENZ = 'toGenZ',
  TO_ENGLISH = 'toEnglish'
}

// History item structure
export interface HistoryItem {
  id: string;
  input: string;
  output: string;
  mode: TranslationMode;
  timestamp: Date;
  isFavorite: boolean;
}

// Dictionary item structure  
export interface DictionaryItem {
  id: string;
  term: string;
  definition: string;
  examples: string[];
  isFavorite: boolean;
}

// User usage tracking
export interface UserUsage {
  translationsToday: number;
  isPremium: boolean;
  lastResetDate: string;
}
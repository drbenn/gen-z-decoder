export class DictionaryVersionResponseDto {
  version: string
  releaseDate: string
  message: string
}

export class DictionaryEntryDto {
  id: string              // UUID from database
  term: string
  definition: string
  examples: string[]
  last_updated: string    // ISO string
}

export class DictionaryDownloadResponseDto {
  version: string
  entries: DictionaryEntryDto[]
  totalEntries: number
}
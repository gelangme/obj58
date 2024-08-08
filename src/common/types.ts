export interface iWord {
  en?: string;
  uk?: string;
  ru?: string;
  original: string;
  inf: string;
  pos: number[];
}

export interface iSentence {
  enTranslation: string;
  ukTranslation: string;
  words: iWord[];
  original?: string;
  type?: string;
}

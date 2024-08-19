export interface iWord {
  en?: string;
  uk?: string;
  original: string;
  inf: string;
  pos: number[];
  type: string;
}

export interface iSentence {
  enTranslation: string;
  ukTranslation: string;
  words: iWord[];
  original?: string;
  type?: string;
}

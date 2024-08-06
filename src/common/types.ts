export interface iWord {
  en?: string;
  ua?: string;
  ru?: string;
  original: string;
  inf: string;
  pos: number[];
}

export interface iSentence {
  translation: string;
  words: iWord[];
  original?: string;
  type?: string;
}

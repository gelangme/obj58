export interface iSentence {
  enTranslation: string; // translation to English
  ukTranslation: string; // translation to Ukrainian
  words: iWord[];
  original?: string;
  type?: "default" | "noTranslation" | "h2" | "space";
}

export interface iWord {
  en?: string;
  uk?: string;
  original: string;
  inf: string;
  pos: number[];
  type: string;
  link: string;
}

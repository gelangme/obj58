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

export interface iUl {
  sentences: iSentence[];
}

interface iTCSentenceSpace {
  data: null;
  type: "space";
}

interface iTCSentenceTitle {
  data: iSentence;
  type: "h2";
}

interface iTCSentenceNoTranslation {
  data: iSentence;
  type: "noTranslation";
}

interface iTCUl {
  data: iUl;
  type: "ul";
}

interface iTCSentence {
  data: iSentence;
  type: "default";
}

interface iTCUl {
  data: iUl;
  type: "ul";
}

export type iTextComponent =
  | iTCSentence
  | iTCUl
  | iTCSentenceNoTranslation
  | iTCSentenceTitle
  | iTCSentenceSpace;

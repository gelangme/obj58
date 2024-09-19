export interface iSentence {
  enTranslation: string; // translation to English
  ukTranslation: string; // translation to Ukrainian
  words: iWord[];
  original?: string;
}

export interface iWord {
  en?: string;
  uk?: string;
  original: string;
  inf: string;
  pos: number[];
  type: string;
  link: string;
  bold?: boolean;
  italic?: boolean;
}

interface iTCSentenceTitle {
  data: iSentence;
  type: "h2";
}

interface iTCSentenceNoTranslation {
  data: iSentence;
  type: "noTranslation";
}

interface iTCSentence {
  data: iSentence;
  type: "default";
}

interface iTCQuote {
  data: iSentence;
  type: "quote";
}

interface iTCUl {
  data: iSentence[];
  type: "list";
}

interface iTCCheckList {
  data: iSentence[];
  type: "checklist";
}

interface iTCSentenceSpace {
  data: null;
  type: "space";
}

interface iTCImage {
  data: string;
  type: "image";
}

export type iTextComponent =
  | iTCSentence
  | iTCUl
  | iTCSentenceNoTranslation
  | iTCSentenceTitle
  | iTCSentenceSpace
  | iTCCheckList
  | iTCQuote
  | iTCImage;

export interface iText {
  text: iTextComponent[];
  videoLink: string;
  title: string;
  description: string;
}

export interface TextMenuItem {
  description: string;
  title: string;
  textID: string;
}

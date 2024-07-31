export interface iWord {
  t: string;
  pos: number | number[];
  original: string;
  inf: string;
  difficulty?: number;
}

export interface iSentence {
  translation: string;
  words: iWord[];
  original?: string;
  type?: string;
}

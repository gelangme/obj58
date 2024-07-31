export interface iWord {
  difficulty: number;
  translation: string;
  wordPosition: number | number[];
  original: string;
  original_short: string;
}

export interface iSentence {
  original: string;
  translation: string;
  words: iWord[];
}

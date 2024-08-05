"use client";

import { useEffect, useState } from "react";

export default function VocabularyPage() {
  const [vocab, setVocab] = useState<any>();
  useEffect(() => {
    const vocab = localStorage.getItem("vocab");
    if (vocab) {
      setVocab(JSON.parse(vocab));
    }
  }, []);

  return vocab ? vocab.map((item: any) => <span>{item + " "}</span>) : null;
}

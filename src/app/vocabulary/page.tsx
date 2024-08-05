"use client";

import { iWord } from "@/common/types";
import { Table, TableProps } from "antd";
import { useEffect, useState } from "react";

interface DataType {
  key: string;
  word: string;
  inf: string;
  translation: string;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Word",
    dataIndex: "word",
    key: "word",
  },
  {
    title: "Inf",
    dataIndex: "inf",
    key: "inf",
  },
  {
    title: "Translation",
    dataIndex: "translation",
    key: "translation",
  },
];

export default function VocabularyPage() {
  const [vocab, setVocab] = useState<iWord[] | undefined | null>();
  const [data, setData] = useState<DataType[] | undefined>();

  useEffect(() => {
    const vocab = localStorage.getItem("vocab");
    if (vocab) {
      setVocab(JSON.parse(vocab));
    }
  }, []);

  useEffect(() => {
    if (vocab) {
      const data: DataType[] = vocab.map((item: iWord, i) => ({
        key: i.toString(),
        word: item.original,
        inf: item.inf,
        translation: item.t,
      }));
      setData(data);
    }
  }, [vocab]);

  return <Table columns={columns} dataSource={data} />;
}

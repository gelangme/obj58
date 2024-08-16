"use client";

import { iWord } from "@/common/types";
import {
  SynonymResponse,
  Translation,
  processWords,
} from "@/utils/vocab.utils";
import { Table, TableProps, Tooltip } from "antd";
import { ReactNode, useEffect, useState } from "react";

interface DataType {
  key: any;
  inf: any;
  translation: any;
}

const columns: TableProps<DataType>["columns"] = [
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

// const getTranslationByLocale = () => {
//   switch (locale) {
//     case value:
//       return

//     default:
//       break;
//   }
// }

export default function VocabularyPage() {
  const [vocab, setVocab] = useState<iWord[] | undefined | null>();
  const [data, setData] = useState<DataType[] | undefined>();
  const [processedWordData, setProcessedWordData] = useState<
    | {
        synonyms: SynonymResponse[];
        translations: Translation[];
      }
    | undefined
  >();

  const fetchData = async () => {
    if (vocab) {
      try {
        const words = vocab.map((vocab) => vocab.inf);
        const result = await processWords(words, "en");

        console.log("Fetch Data Result: ", { result });

        // Set the state with the result from processWords (now arrays)
        setProcessedWordData(result);
      } catch (error) {
        console.error("Error fetching processed words:", error);
        setProcessedWordData(undefined); // Handle the error state
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [vocab]);

  useEffect(() => {
    const vocab = localStorage.getItem("vocab");
    if (vocab) {
      setVocab(JSON.parse(vocab));
    }
  }, []);

  useEffect(() => {
    if (vocab && processedWordData) {
      const data: DataType[] = vocab.map((item: iWord, i) => ({
        key: i.toString(),
        inf: (
          <Tooltip
            title={processedWordData.synonyms[i].data.synsets.map(
              (item) => item.lemma
            )}
          >
            {item.inf}
          </Tooltip>
        ),
        translation: processedWordData.translations[i].word,
      }));
      setData(data);
    }
  }, [vocab, processedWordData]);

  return <Table columns={columns} dataSource={data} />;
}

"use client";

import { iWord } from "@/common/types";
import {
  DatamuseResponse,
  processWords,
  translateWords,
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
  const [processedWordData, setProcessedWordData] = useState<{
    synonyms: (DatamuseResponse[] | null)[];
    translations: (string | null)[];
  }>();

  const [translations, setTranslations] = useState<(string | null)[]>();
  const [synonyms, setSynonyms] = useState<(string | null)[]>();

  const fetchData = async () => {
    if (vocab) {
      try {
        const words = vocab.map((vocab) => vocab.inf);
        const result = await processWords(words, "en");

        console.log("Fetch Data Result: ", { result });

        setProcessedWordData(result);
      } catch (error) {
        console.error("Error fetching processed words:", error);
        setProcessedWordData(undefined);
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
          <div className="flex flex-row items-center justify-start gap-2">
            <span className="opacity-70 text-sm">({item.type})</span>
            <span>{item.inf}</span>
          </div>
        ),
        // translation: processedWordData.translations[i],
        translation:
          processedWordData.synonyms[i] !== null &&
          processedWordData.synonyms[i].length !== 0 ? (
            <Tooltip
              title={
                <div className="flex flex-row gap-4">
                  {
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg opacity-60">
                        Synonyms
                      </span>
                      {processedWordData.synonyms[i].map((item) => (
                        <span>{item.word}</span>
                      ))}
                    </div>
                  }
                </div>
              }
            >
              {processedWordData.translations[i]}
            </Tooltip>
          ) : (
            processedWordData.translations[i]
          ),
      }));
      setData(data);
    }
  }, [vocab, processedWordData]);

  return <Table columns={columns} dataSource={data} />;
}

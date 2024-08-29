"use client";

import { iWord } from "@/common/types";
import { interfaceLocaleAtom, translationLocaleAtom } from "@/state/atoms";
import { DatamuseResponse, processWords } from "@/utils/vocab.utils";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Select,
  Table,
  TableProps,
  Tooltip,
} from "antd";
import { useAtomValue } from "jotai";
import { ReactNode, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useMediaQuery } from "react-responsive";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";

interface DataType {
  key: any;
  searchInf: string;
  searchType: string;
  inf: any;
  translation: any;
}

export interface VocabWord {
  inf: string;
  type: string;
  en?: TranslationData;
  uk?: TranslationData;
}

export interface TranslationData {
  translation?: string | null;
  synonyms?: DatamuseResponse[] | null;
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

export type SearchFormProps = {
  search: string;
  partOfSpeech: string;
};

const DeleteOutlinedIcon = React.createElement(DeleteOutlined);

export default function VocabularyPage() {
  const interfaceLocale = useAtomValue(interfaceLocaleAtom);
  const translationLocale = useAtomValue(translationLocaleAtom);

  const currentLocale =
    translationLocale === "default"
      ? interfaceLocale === "de"
        ? "en"
        : interfaceLocale
      : translationLocale;

  console.log("currentLocale: ", currentLocale);

  const [searchForm] = Form.useForm<SearchFormProps>();

  const [vocab, setVocab] = useState<VocabWord[] | undefined | null>();
  const [data, setData] = useState<DataType[] | undefined>();
  const [dataAfterSearch, setDataAfterSearch] = useState<
    DataType[] | undefined
  >();
  const [csvData, setCsvData] = useState<
    (string | null | undefined)[][] | undefined
  >();
  const [processedWordData, setProcessedWordData] = useState<{
    synonyms: (DatamuseResponse[] | null)[];
    translations: (string | null)[];
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useMediaQuery({ maxWidth: 970 });
  const [deleteModeEnabled, setDeleteModeEnabled] = useState(false);
  const [idsForDeletion, setIdsForDeletion] = useState<number[]>([]);

  function getTranslationData(
    word: VocabWord,
    locale: keyof VocabWord
  ): TranslationData {
    return word[locale] as TranslationData;
  }

  const fetchData = async () => {
    if (vocab) {
      try {
        console.log("API OldVocab", vocab);

        let wordsToTranslate: any = [];
        for (let index = 0; index < vocab.length; index++) {
          if (!(currentLocale in vocab[index])) {
            wordsToTranslate.push({
              inf: vocab[index].inf,
              vocabIndex: index,
            });
          }
        }
        console.log("API wordsToTranslate: ", wordsToTranslate);

        if (wordsToTranslate.length === 0) {
          setIsLoading(false);
          return;
        }

        console.log(
          "API wordsToTranslate: ",
          wordsToTranslate.map((item: any) => item.inf)
        );

        const result = await processWords(
          wordsToTranslate.map((item: any) => item.inf),
          currentLocale
        );
        console.log("Fetch Data Result: ", { result });

        for (let index = 0; index < wordsToTranslate.length; index++) {
          const vocabIndex = wordsToTranslate[index].vocabIndex;
          vocab[vocabIndex][currentLocale] = {
            translation: result.translations[index],
            synonyms: result.synonyms[index],
          };
        }

        const stringifiedOldVocab = JSON.stringify(vocab);

        const newVocab = JSON.parse(stringifiedOldVocab);
        setVocab(newVocab);

        console.log("API NewVocab", vocab);

        localStorage.setItem("vocab", JSON.stringify(newVocab));
      } catch (error) {
        console.error("Error fetching processed words:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [vocab]);

  useEffect(() => {
    const vocab = localStorage.getItem("vocab");
    console.log;
    if (vocab) {
      setVocab(JSON.parse(vocab));
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (vocab && !isLoading) {
      const data: DataType[] = vocab.map((item, i) => ({
        key: i.toString(),
        searchInf: item.inf,
        searchType: item.type,
        inf: (
          <div className="flex flex-row items-center justify-start gap-2">
            {deleteModeEnabled ? (
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    setIdsForDeletion([...idsForDeletion, i]);
                  } else {
                    const newIdsForDeleteion = [...idsForDeletion];
                    const index = newIdsForDeleteion.indexOf(i);
                    newIdsForDeleteion.splice(index, 1);
                    setIdsForDeletion(newIdsForDeleteion);
                  }
                }}
              />
            ) : null}
            <span className="opacity-70 text-sm">({item.type})</span>
            <span>{item.inf}</span>
          </div>
        ),
        translation:
          getTranslationData(item, currentLocale)?.synonyms !== null &&
          getTranslationData(item, currentLocale)?.synonyms?.length !== 0 ? (
            <Tooltip
              title={
                <div className="flex flex-row gap-4">
                  {
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg opacity-60">
                        Synonyms
                      </span>
                      {item.en?.synonyms?.map((item, index) => (
                        <span key={`${item.word}-${index}-synonym`}>
                          {item.word}
                        </span>
                      ))}
                    </div>
                  }
                </div>
              }
            >
              {item.en?.translation}
            </Tooltip>
          ) : (
            getTranslationData(item, currentLocale)?.translation
          ),
      }));
      setData(data);

      const csvData = vocab.map((item, i) => [
        item.inf,
        getTranslationData(item, currentLocale)?.translation,
      ]);
      csvData.unshift(["infinitive", "translation"]);
      setCsvData(csvData);
      console.log("CSV_DATA: ", csvData);
    }
  }, [vocab, isLoading, deleteModeEnabled]);

  const executeSearch = (values: SearchFormProps) => {
    console.log("Received values of form: ", values);

    if (values.partOfSpeech === "" && values.search === "") {
      return setDataAfterSearch(undefined);
    } else if (values.partOfSpeech !== "" && values.search !== "") {
      let dataAfterSearch = data?.filter((x) =>
        x.searchInf.toLowerCase().includes(values.search.toLowerCase())
      );

      dataAfterSearch = dataAfterSearch?.filter(
        (x) => x.searchType.toLowerCase() === values.partOfSpeech.toLowerCase()
      );
      return setDataAfterSearch(dataAfterSearch);
    } else if (values.partOfSpeech !== "") {
      let dataAfterSearch = data?.filter(
        (x) => x.searchType.toLowerCase() === values.partOfSpeech.toLowerCase()
      );
      return setDataAfterSearch(dataAfterSearch);
    } else if (values.search !== "") {
      let dataAfterSearch = data?.filter((x) =>
        x.searchInf.toLowerCase().includes(values.search.toLowerCase())
      );
      return setDataAfterSearch(dataAfterSearch);
    }
  };

  useEffect(() => {
    console.log("DELETION_LOG: ", {
      idsForDeletion,
      deleteModeEnabled,
      dataAfterSearch,
    });
  }, [idsForDeletion, deleteModeEnabled, dataAfterSearch]);

  return (
    <>
      <Form
        layout={isMobile ? "vertical" : "inline"}
        form={searchForm}
        initialValues={{ search: "", partOfSpeech: "" }}
        onFinish={executeSearch}
        autoComplete="off"
        style={{ maxWidth: "none" }}
      >
        <Form.Item label="Includes" name="search" colon={false}>
          <Input placeholder="Search for a word" />
        </Form.Item>
        <Form.Item label="Part of speech" name="partOfSpeech" colon={false}>
          <Select
            style={{ minWidth: 150 }} // Set the minimum width here
            options={[
              { value: "noun", label: <span>Noun (Nomen)</span> },
              { value: "pronoun", label: <span>Pronoun (Pronomen)</span> },
              { value: "verb", label: <span>Verb (Verb)</span> },
              { value: "adjective", label: <span>Adjective (Adjektiv)</span> },
              { value: "adverb", label: <span>Adverb (Adverb)</span> },
              {
                value: "preposition",
                label: <span>Preposition (Präposition)</span>,
              },
              {
                value: "conjunction",
                label: <span>Conjunction (Konjunktion)</span>,
              },
              {
                value: "interjection",
                label: <span>Interjection (Interjektion)</span>,
              },
              { value: "article", label: <span>Article (Artikel)</span> },
            ]}
          />
        </Form.Item>
        <Form.Item layout="horizontal">
          <Button type="default" htmlType="submit">
            Submit
          </Button>
          <Button
            onClick={() => {
              searchForm.resetFields();
              setDataAfterSearch(undefined);
            }}
            type="text"
            danger
            className="ml-2"
          >
            Clear
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      {!dataAfterSearch ? (
        deleteModeEnabled ? (
          <div className="flex flex-row gap-2">
            <Button onClick={() => setDeleteModeEnabled(false)}>
              {DeleteOutlinedIcon} Cancel
            </Button>
            {idsForDeletion.length !== 0 ? (
              <Button
                danger
                onClick={() => {
                  const newVocab = JSON.parse(JSON.stringify(vocab));
                  // Step 1: Sort the indexesToDelete array in descending order
                  idsForDeletion.sort((a, b) => b - a);

                  // Step 2: Iterate through the sorted array and delete the elements
                  idsForDeletion.forEach((index) => {
                    newVocab.splice(index, 1); // Splice removes 1 element at the specified index
                  });
                  setDeleteModeEnabled(false);
                  setIdsForDeletion([]);
                  setVocab(newVocab);
                  localStorage.setItem("vocab", JSON.stringify(newVocab));
                }}
              >
                {DeleteOutlinedIcon} Delete Selected
              </Button>
            ) : null}
          </div>
        ) : (
          <Button onClick={() => setDeleteModeEnabled(true)}>
            {DeleteOutlinedIcon} Delete items
          </Button>
        )
      ) : null}
      <Table
        loading={isLoading}
        columns={columns}
        className="mt-4"
        dataSource={!!dataAfterSearch ? dataAfterSearch : data}
      />
      {csvData ? <CSVLink data={csvData}>Download CSV</CSVLink> : null}
    </>
  );
}

"use client";

import { iWord } from "@/common/types";
import { interfaceLocaleAtom, translationLocaleAtom } from "@/state/atoms";
import {
  DatamuseResponse,
  getTranslationData,
  processWords,
} from "@/utils/vocab.utils";
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
import Link from "next/link";
import { generatePDF } from "@/utils/pdfUtils";
import { useTranslation } from "react-i18next";

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
  index: number;
}

export interface TranslationData {
  translation?: string | null;
  synonyms?: DatamuseResponse[] | null;
}

export type SearchFormProps = {
  search: string;
  partOfSpeech: string;
};

const DeleteOutlinedIcon = React.createElement(DeleteOutlined);

export default function VocabularyPage() {
  const { t } = useTranslation();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("inf"),
      dataIndex: "inf",
      key: "inf",
    },
    {
      title: t("translation"),
      dataIndex: "translation",
      key: "translation",
    },
  ];

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
  const [vocabAfterSearch, setVocabAfterSearch] = useState<
    VocabWord[] | undefined | null
  >();
  const [dataAfterSearch, setDataAfterSearch] = useState<
    DataType[] | undefined
  >();
  const [csvData, setCsvData] = useState<
    (string | null | undefined)[][] | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMobile = useMediaQuery({ maxWidth: 970 });
  const [deleteModeEnabled, setDeleteModeEnabled] = useState(false);
  const [idsForDeletion, setIdsForDeletion] = useState<number[]>([]);

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
      setVocab(reIndexVocab(JSON.parse(vocab)));
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
                    const newArr = [...idsForDeletion, i];
                    setIdsForDeletion(newArr);
                  } else {
                    const newIdsForDeleteion = [...idsForDeletion];
                    const index = newIdsForDeleteion.indexOf(i);
                    newIdsForDeleteion.splice(index, 1);
                    setIdsForDeletion(newIdsForDeleteion);
                  }
                }}
              />
            ) : null}
            <span className="opacity-70 text-sm">({t(item.type)})</span>
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
                        {t("synonyms")}
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

      const csvData = vocab.map((item) => [
        item.inf,
        getTranslationData(item, currentLocale)?.translation,
      ]);
      csvData.unshift(["infinitive", "translation"]);
      setCsvData(csvData);
      console.log("CSV_DATA: ", csvData);
    }
  }, [vocab, isLoading, deleteModeEnabled, idsForDeletion]);

  useEffect(() => {
    if (vocab && vocabAfterSearch && !isLoading) {
      const data: DataType[] = vocabAfterSearch.map((item, i) => ({
        key: `filtered-word-${i}`,
        searchInf: item.inf,
        searchType: item.type,
        inf: (
          <div className="flex flex-row items-center justify-start gap-2">
            {deleteModeEnabled ? (
              <Checkbox
                onChange={(e) => {
                  const wordIndex = vocab.findIndex((x) => x.inf === item.inf);
                  if (e.target.checked) {
                    setIdsForDeletion([...idsForDeletion, wordIndex]);
                  } else {
                    const newIdsForDeleteion = [...idsForDeletion];
                    const index = newIdsForDeleteion.indexOf(wordIndex);
                    newIdsForDeleteion.splice(index, 1);
                    setIdsForDeletion(newIdsForDeleteion);
                  }
                }}
              />
            ) : null}
            <span className="opacity-70 text-sm">({t(item.type)})</span>
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
      setDataAfterSearch(data);
    }
  }, [vocabAfterSearch, deleteModeEnabled, idsForDeletion, vocab]);

  const executeSearch = (values: SearchFormProps) => {
    console.log("Received values of form: ", values);
    setDeleteModeEnabled(false);
    setIdsForDeletion([]);

    const { search, partOfSpeech } = values;

    if (!search && !partOfSpeech) {
      return setVocabAfterSearch(undefined);
    }

    if (!vocab) {
      return setVocabAfterSearch(undefined);
    }

    let newVocabAfterSearch = JSON.parse(JSON.stringify(vocab)) as VocabWord[];

    if (search) {
      newVocabAfterSearch = newVocabAfterSearch?.filter((x) =>
        x.inf.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (partOfSpeech) {
      newVocabAfterSearch = newVocabAfterSearch?.filter(
        (x) => x.type.toLowerCase() === partOfSpeech.toLowerCase()
      );
    }

    setVocabAfterSearch(newVocabAfterSearch);
  };

  const reIndexVocab = (vocabToReIndex: VocabWord[]) => {
    const newVocab: VocabWord[] = JSON.parse(JSON.stringify(vocabToReIndex));
    newVocab.forEach((element, i) => {
      element.index = i;
    });
    return newVocab;
  };

  useEffect(() => {
    console.log("DELETION_LOG: ", {
      idsForDeletion,
      deleteModeEnabled,
      vocabAfterSearch,
      dataAfterSearch,
    });
  }, [idsForDeletion, deleteModeEnabled, vocabAfterSearch, dataAfterSearch]);

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
        <Form.Item label={t("includes")} name="search" colon={false}>
          <Input placeholder={t("search-placeholder")} />
        </Form.Item>
        <Form.Item
          label={t("part-of-speech")}
          name="partOfSpeech"
          colon={false}
        >
          <Select
            style={{ minWidth: 150 }} // Set the minimum width here
            options={[
              { value: "noun", label: <span>{t("noun")} (Nomen)</span> },
              {
                value: "pronoun",
                label: <span>{t("pronoun")} (Pronomen)</span>,
              },
              { value: "verb", label: <span>{t("verb")} (Verb)</span> },
              {
                value: "adjective",
                label: <span>{t("adjective")} (Adjektiv)</span>,
              },
              { value: "adverb", label: <span>{t("adverb")} (Adverb)</span> },
              {
                value: "preposition",
                label: <span>{t("preposition")} (Präposition)</span>,
              },
              {
                value: "conjunction",
                label: <span>{t("conjunction")} (Konjunktion)</span>,
              },
              {
                value: "interjection",
                label: <span>{t("interjection")} (Interjektion)</span>,
              },
              {
                value: "article",
                label: <span>{t("article")} (Artikel)</span>,
              },
            ]}
          />
        </Form.Item>
        <Form.Item layout="horizontal">
          <Button type="default" htmlType="submit">
            {t("apply")}
          </Button>
          <Button
            onClick={() => {
              searchForm.resetFields();
              setDataAfterSearch(undefined);
              setVocabAfterSearch(undefined);
            }}
            type="text"
            danger
            className="ml-2"
          >
            {t("clear")}
          </Button>
        </Form.Item>
      </Form>
      <Divider />
      {deleteModeEnabled ? (
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => {
              setIdsForDeletion([]);
              setDeleteModeEnabled(false);
            }}
          >
            {DeleteOutlinedIcon} {t("cancel")}
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

                if (!!vocabAfterSearch && vocab) {
                  const newVocabAfterSearch: VocabWord[] = JSON.parse(
                    JSON.stringify(vocabAfterSearch)
                  );
                  idsForDeletion.forEach((index) => {
                    newVocabAfterSearch.splice(
                      newVocabAfterSearch.findIndex(
                        (x) => x.inf === vocab[index].inf
                      ),
                      1
                    ); // Splice removes 1 element at the specified index
                  });
                  setVocabAfterSearch(newVocabAfterSearch);
                }
                setDeleteModeEnabled(false);
                setIdsForDeletion([]);
                setVocab(newVocab);
                localStorage.setItem("vocab", JSON.stringify(newVocab));
              }}
            >
              {DeleteOutlinedIcon} {t("del-selected")}
            </Button>
          ) : null}
        </div>
      ) : vocab && vocab.length !== 0 ? (
        <Button onClick={() => setDeleteModeEnabled(true)}>
          {DeleteOutlinedIcon} {t("del-items")}
        </Button>
      ) : null}
      <Table
        loading={isLoading}
        columns={columns}
        className="mt-4"
        dataSource={!!dataAfterSearch ? dataAfterSearch : data}
      />
      {vocab && vocab.length !== 0 ? (
        <div className="flex flex-col gap-4 md:flex-row">
          {csvData ? (
            <CSVLink data={csvData}>{t("download")} CSV</CSVLink>
          ) : null}
          {vocab && !isLoading ? (
            <Link
              className="!text-red-600 hover:!text-red-400"
              href="#"
              onClick={() => generatePDF(vocab, currentLocale)}
            >
              {t("download")} PDF
            </Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

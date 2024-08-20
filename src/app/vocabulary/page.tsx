"use client";

import { iWord } from "@/common/types";
import {
  DatamuseResponse,
  processWords,
  translateWords,
} from "@/utils/vocab.utils";
import { Button, Form, Input, Select, Table, TableProps, Tooltip } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { CSVLink } from "react-csv";

interface DataType {
  key: any;
  searchInf: string;
  searchType: string;
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

export type SearchFormProps = {
  search: string;
  partOfSpeech: string;
};

export default function VocabularyPage() {
  const [searchForm] = Form.useForm<SearchFormProps>();

  const [vocab, setVocab] = useState<iWord[] | undefined | null>();
  const [data, setData] = useState<DataType[] | undefined>();
  const [dataAfterSearch, setDataAfterSearch] = useState<
    DataType[] | undefined
  >();
  const [csvData, setCsvData] = useState<(string | null)[][] | undefined>();
  const [processedWordData, setProcessedWordData] = useState<{
    synonyms: (DatamuseResponse[] | null)[];
    translations: (string | null)[];
  }>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchValue, setSearchValue] = useState("");

  const fetchData = async () => {
    if (vocab) {
      try {
        const words = vocab.map((vocab) => vocab.inf);
        const result = await processWords(words, "en");

        console.log("Fetch Data Result: ", { result });

        setProcessedWordData(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching processed words:", error);
        setProcessedWordData(undefined);
        setIsLoading(false);
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
    if (vocab && processedWordData) {
      const data: DataType[] = vocab.map((item: iWord, i) => ({
        key: i.toString(),
        searchInf: item.inf,
        searchType: item.type,
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

      const csvData = vocab.map((item, i) => [
        item.inf,
        processedWordData.translations[i],
      ]);
      csvData.unshift(["infinitive", "translation"]);
      setCsvData(csvData);
      console.log("CSV_DATA: ", csvData);
    }
  }, [vocab, processedWordData]);

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

  return (
    <>
      <Form
        layout="inline"
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
        <Form.Item>
          <Button type="default" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              searchForm.resetFields();
              setDataAfterSearch(undefined);
            }}
            type="text"
            danger
          >
            Clear
          </Button>
        </Form.Item>
      </Form>
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

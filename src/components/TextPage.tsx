"use client";
import { iSentence, iWord } from "@/common/types";
import Sentence from "./Sentence";
import { Button, Card, Modal, Select, Tooltip } from "antd";
import { SettingFilled } from "@ant-design/icons";
import LocaleSelect from "./LocaleSelect";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import YouTubeVideo from "./YouTubeVideo";

export default function TextPage({ text }: { text: iSentence[] }) {
  const router = useRouter();
  const params = useParams<{ textLocale: string }>();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [numOfUniqueWords, setNumOfUniqueWords] = useState<number>();

  const handleTextLocaleChange = (value: string) => {
    localStorage.setItem("textLocale", value);
    router.push(pathname.replace(`/${params.textLocale}`, `/${value}`));
  };

  const calcUniqueWords = () => {
    let allWords: iWord[] = text.reduce(
      (acc: any, item) => [...acc, ...item.words],
      []
    );
    allWords = allWords.reduce((acc: any, item) => [...acc, item.inf], []);
    const uniqueWords = Array.from(new Set(allWords));
    setNumOfUniqueWords(uniqueWords.length);
  };

  useEffect(() => {
    calcUniqueWords();
  }, []);

  return (
    <>
      <Modal
        title={t("Text Settings")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-row items-center justify-start gap-3">
          {/* todo: add new string to i18nexus */}
          <span>Translated text language</span>
          <LocaleSelect
            value={params.textLocale}
            onChange={handleTextLocaleChange}
          />
        </div>
      </Modal>

      <Button
        type="text"
        icon={React.createElement(SettingFilled)}
        onClick={() => setIsModalOpen(true)}
      />
      <div className="flex flex:col-reverse lg:flex-row lg:justify-between gap-4">
        <div className="flex flex-col">
          {text.map((item) => (
            <Sentence
              key={item.original}
              textLocale={params.textLocale}
              sentence={item}
            />
          ))}
        </div>
        <YouTubeVideo />
      </div>
      {/* todo: add new string to i18nexus */}
      <Tooltip title="Number of unique words in the text">
        <div className="flex justify-center items-center w-[32px] h-[32px]">
          <span className="opacity-10 hover:opacity-50 transition-opacity duration-300 cursor-default text-center grow">
            {numOfUniqueWords}
          </span>
        </div>
      </Tooltip>
    </>
  );
}

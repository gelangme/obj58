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
import { useAtom } from "jotai";
import { translationLocaleAtom } from "@/state/atoms";

export default function FilePageClient({
  text,
  videoLink,
}: {
  text: iSentence[];
  videoLink: string;
}) {
  const router = useRouter();
  const params = useParams<{ textLocale: string }>();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [translationLocale, setTranslationLocale] = useAtom(
    translationLocaleAtom
  );
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
        title={t("text-settings")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-row items-center justify-start gap-3">
          <span>{t("translation-lang")}</span>
          <LocaleSelect
            value={translationLocale}
            onChange={(lang: any) => {
              setTranslationLocale(lang);
            }}
            isInterfaceLocale={false}
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
            <Sentence key={item.original} sentence={item} />
          ))}
        </div>
        {!!videoLink ? <YouTubeVideo videoLink={videoLink} /> : null}
      </div>
      {/* todo: add new string to i18nexus */}
      <Tooltip title={t("num-unique-words")}>
        <div className="flex justify-center items-center w-[32px] h-[32px]">
          <span className="opacity-10 hover:opacity-50 transition-opacity duration-300 cursor-default text-center grow">
            {numOfUniqueWords}
          </span>
        </div>
      </Tooltip>
    </>
  );
}

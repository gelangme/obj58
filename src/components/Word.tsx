"use client";
import { iWord } from "@/common/types";
import { Button, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { json } from "stream/consumers";
import { useTranslation } from "react-i18next";
import { useParams, useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { translationLocaleAtom } from "@/state/atoms";
import { VocabWord } from "@/app/vocabulary/page";

interface iWordComponent {
  word: iWord;
  noTooltip?: boolean;
  whiteSpace?: boolean;
  className?: string;
}

const plusIcon = React.createElement(PlusOutlined);
const checkIcon = React.createElement(CheckOutlined);

export default function Word({
  word,
  noTooltip,
  whiteSpace,
  className = "",
}: iWordComponent) {
  const { i18n } = useTranslation();
  const checkIfAddedToVocab = () => {
    const vocab = localStorage.getItem("vocab");
    if (vocab) {
      const filteredVocab = JSON.parse(vocab).filter(
        (item: VocabWord) => item.inf === word.inf
      );
      if (filteredVocab.length !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const [isAddedToVocab, setIsAddedToVocab] = useState<boolean>();
  const [translation, setTranslation] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const translationLocale = useAtomValue(translationLocaleAtom);

  useEffect(() => {
    setIsAddedToVocab(checkIfAddedToVocab());
  }, []);

  const addToVocab = () => {
    setIsAddedToVocab(true);

    const vocab = localStorage.getItem("vocab");

    if (vocab) {
      const newVocab: VocabWord[] = JSON.parse(vocab);
      newVocab.push({
        inf: word.inf,
        type: word.type,
        index: newVocab.length,
      });

      return localStorage.setItem("vocab", JSON.stringify(newVocab));
    }

    const newVocab: VocabWord[] = [
      { inf: word.inf, type: word.type, index: 0 },
    ];
    localStorage.setItem("vocab", JSON.stringify(newVocab));
  };

  const initTranslation = () => {
    const lang = searchParams.get("lang");
    // console.log("LOCALES: ", {
    //   lang: lang,
    //   translationLocale: translationLocale,
    //   i18n: i18n.language,
    // });

    if (lang) {
      return setTranslation(getTranslation(lang) as string);
    }

    if (translationLocale === "default") {
      return setTranslation(getTranslation(i18n.language) as string);
    } else {
      return setTranslation(getTranslation(translationLocale) as string);
    }
  };

  const getTranslation = (language: string) => {
    switch (language) {
      case "en":
        return word.en;
      case "uk":
        return word.uk;
      default:
        return word.en;
    }
  };

  useEffect(() => {
    initTranslation();
  }, [translationLocale, i18n]);

  return noTooltip ? (
    <span className={className}>{word.original}</span>
  ) : (
    <Tooltip
      className="z-[1501]"
      title={
        <div className="flex flex-row gap-1 items-center">
          {isAddedToVocab ? (
            <CheckOutlined />
          ) : (
            <PlusOutlined onClick={addToVocab} />
          )}
          <span>{translation}</span>
        </div>
      }
      mouseEnterDelay={0}
    >
      {whiteSpace && " "}
      <span className={"hover:bg-slate-400 cursor-pointer " + className}>
        {word.original}
      </span>
    </Tooltip>
  );
}

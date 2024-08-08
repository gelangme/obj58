"use client";
import { iSentence } from "@/common/types";
import Sentence from "./Sentence";
import { Card, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import LocaleSelect from "./LocaleSelect";

export default function MainText({ text }: { text: iSentence[] }) {
  const { i18n } = useTranslation();

  const [textLocale, setTextLocale] = useState("default");

  const initTextLocale = () => {
    const textLocale = localStorage.getItem("textLocale");
    if (textLocale) {
      return textLocale;
    } else {
      localStorage.setItem("textLocale", "default");
      return "default";
    }
  };

  useEffect(() => {
    initTextLocale();
  }, []);

  return (
    <>
      <LocaleSelect
        className="w-full"
        value={textLocale}
        onChange={(value: string) => {
          setTextLocale(value);
          localStorage.setItem("textLocale", value);
        }}
        isInterfaceLocale
      />
      {text.map((item) => (
        <Sentence sentence={item} />
      ))}
    </>
  );
}

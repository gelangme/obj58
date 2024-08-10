"use client";
import { iSentence } from "@/common/types";
import Sentence from "./Sentence";
import { Button, Card, Modal, Select } from "antd";
import { SettingFilled } from "@ant-design/icons";
import LocaleSelect from "./LocaleSelect";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { textLocaleAtom } from "./AntdLayout";

export default function TextPage({ text }: { text: iSentence[] }) {
  const router = useRouter();
  const params = useParams<{ textLocale: string }>();
  const pathname = usePathname();
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [textLocale, setTextLocale] = useAtom(textLocaleAtom);

  const handleTextLocaleChange = (value: string) => {
    localStorage.setItem("textLocale", value);
    router.push(pathname.replace(`/${params.textLocale}`, `/${value}`));
  };

  //todo: decide if i need to replace users textLocale if he visited a url with a locale different from users locale
  // useEffect(() => {
  //   if (params.textLocale === textLocale) {
  //     return;
  //   } else {
  //     const isSupportedLocale = ["en", "uk"].some(
  //       (value) => value === textLocale
  //     );
  //     if (isSupportedLocale) {
  //       setTextLocale(params.textLocale);
  //     }
  //   }
  // });

  return (
    <>
      <Modal
        title={t("Text Settings")}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="flex flex-row items-center justify-start gap-3">
          <span>Translated text language</span>
          <LocaleSelect
            value={params.textLocale}
            onChange={handleTextLocaleChange}
          />
        </div>
      </Modal>

      <Button
        className="w-10 h-10"
        type="text"
        icon={React.createElement(SettingFilled)}
        onClick={() => setIsModalOpen(true)}
      />

      {text.map((item) => (
        <Sentence
          key={item.original}
          textLocale={params.textLocale}
          sentence={item}
        />
      ))}
    </>
  );
}

"use client";

import LocaleSelect from "@/components/LocaleSelect";
import { Switch } from "antd";
import { GlobalOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { atom, useAtom } from "jotai";
import {
  interfaceLocaleAtom,
  isDarkModeAtom,
  translationLocaleAtom,
} from "@/state/atoms";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);
  const [interfaceLocale, setInterfaceLocale] = useAtom(interfaceLocaleAtom);
  const [translationLocale, setTranslationLocale] = useAtom(
    translationLocaleAtom
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-start gap-3">
        <span>{t("interface-lang")}</span>
        <LocaleSelect
          value={interfaceLocale}
          onChange={(lang: any) => {
            setInterfaceLocale(lang);
            i18n.changeLanguage(lang);
          }}
          isInterfaceLocale
        />
      </div>
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
      <div className="flex flex-row items-center justify-start gap-3">
        <span>{t("interface-theme")}</span>
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          value={isDarkMode}
          onChange={(value) => {
            console.log("SWITCH VALUE: ", value);
            setIsDarkMode(value);
            localStorage.setItem("isDarkMode", JSON.stringify(value));
          }}
        />
      </div>
      <div className="flex flex-row"></div>
    </div>
  );
}

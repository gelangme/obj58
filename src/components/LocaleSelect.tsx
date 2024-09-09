"use client";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const interfacelLocaleOptions = [
  { value: "en", label: "english" },
  { value: "de", label: "deutsch" },
  { value: "uk", label: "українська" },
];

export default function LocaleSelect({
  className = "",
  value,
  onChange,
  isInterfaceLocale = false,
  customOptions = undefined,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  isInterfaceLocale?: boolean;
  customOptions?:
    | {
        value: string;
        label: string;
      }[]
    | undefined;
}) {
  const { t } = useTranslation();

  const translationLocaleOptions = [
    { value: "en", label: "english" },
    { value: "uk", label: "українська" },
    { value: "default", label: t("same-as-interface") },
  ];

  const translationLocaleOptionsNoDefault = [
    { value: "en", label: "english" },
    { value: "uk", label: "українська" },
  ];

  return (
    <Select
      className={className}
      value={value}
      onChange={onChange}
      options={isInterfaceLocale ? interfacelLocaleOptions : customOptions}
    />
  );
}

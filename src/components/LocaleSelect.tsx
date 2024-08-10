"use client";
import { Select } from "antd";

const interfacelLocaleOptions = [
  { value: "en", label: "english" },
  { value: "de", label: "deutsch" },
  { value: "uk", label: "українська" },
];

const textLocaleOptions = [
  { value: "en", label: "english" },
  { value: "uk", label: "українська" },
];

export default function LocaleSelect({
  className = "",
  value,
  onChange,
  isInterfaceLocale = false,
}: {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  isInterfaceLocale?: boolean;
}) {
  return (
    <Select
      className={className}
      value={value}
      onChange={onChange}
      options={isInterfaceLocale ? interfacelLocaleOptions : textLocaleOptions}
    />
  );
}

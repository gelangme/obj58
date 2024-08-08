import { Select } from "antd";

const interfacelLocaleOptions = [
  { value: "en", label: "english" },
  { value: "de", label: "deutsch" },
  { value: "uk", label: "українська" },
];

const textLocaleOptions = [
  { value: "en", label: "english" },
  { value: "de", label: "deutsch" },
  { value: "uk", label: "українська" },
  { value: "default", label: "default" },
];

export default function LocaleSelect({
  className,
  value,
  onChange,
  isInterfaceLocale,
}: {
  className: string;
  value: string;
  onChange: (value: string) => void;
  isInterfaceLocale: boolean;
}) {
  return (
    <Select
      //   className="absolute top-0 left-0 min-w-4"
      className={className}
      value={value}
      onChange={onChange}
      options={isInterfaceLocale ? interfacelLocaleOptions : textLocaleOptions}
    />
  );
}

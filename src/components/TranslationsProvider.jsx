"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance } from "i18next";
import { useAtomValue } from "jotai";
import { interfaceLocaleAtom } from "./AntdLayout";

export default function TranslationsProvider({
  children,
  // locale,
  namespaces,
  resources,
}) {
  const i18n = createInstance();
  const interfaceLocale = useAtomValue(interfaceLocaleAtom);

  initTranslations(interfaceLocale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

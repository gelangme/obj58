import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdLayout, { interfaceLocaleAtom } from "@/components/AntdLayout";
import { getJsonFiles } from "@/utils/readFileData";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "./i18n";

const inter = Inter({ subsets: ["latin"] });

const i18nNamespaces = ["main"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resources } = await initTranslations("en", i18nNamespaces);
  const directory = getJsonFiles();

  return (
    <html lang="en">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <TranslationsProvider namespaces={i18nNamespaces} resources={resources}>
          <AntdRegistry>
            <AntdLayout directory={directory}>{children}</AntdLayout>
          </AntdRegistry>
        </TranslationsProvider>
      </body>
    </html>
  );
}

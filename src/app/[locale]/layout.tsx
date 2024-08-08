import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdLayout from "@/components/AntdLayout";
import { getJsonFiles } from "@/utils/readFileData";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "../i18n";

const inter = Inter({ subsets: ["latin"] });

const i18nNamespaces = ["main"];

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { resources } = await initTranslations(params.locale, i18nNamespaces);
  const directory = getJsonFiles();

  return (
    <html lang="en">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={params.locale}
          resources={resources}
        >
          <AntdRegistry>
            <AntdLayout directory={directory}>{children}</AntdLayout>
          </AntdRegistry>
        </TranslationsProvider>
      </body>
    </html>
  );
}

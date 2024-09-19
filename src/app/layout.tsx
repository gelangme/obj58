import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdLayout from "@/components/AntdLayout";
import { getJsonFiles } from "@/utils/readFileData";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "./i18n";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

const i18nNamespaces = ["main", "home"];
type PageProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: PageProps) {
  const { resources } = await initTranslations("en", i18nNamespaces);

  const menuData = await axios.get("http://localhost:3001/menu");
  const menuItems = await menuData.data;
  console.log("menuItems: ", { menuItems });

  return (
    <html lang="en">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <TranslationsProvider namespaces={i18nNamespaces} resources={resources}>
          <AntdRegistry>
            <AntdLayout fetchedMenuItems={menuItems}>{children}</AntdLayout>
          </AntdRegistry>
        </TranslationsProvider>
      </body>
    </html>
  );
}

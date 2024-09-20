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

  // async function checkLoginStatus() {
  //   try {
  //     const response = await axios.get("http://localhost:3001/auth/check", {
  //       withCredentials: true,
  //     });

  //     console.log("USER_RESPONSE: ", { response });

  //     if (response.status === 200) {
  //       const data = response.data;
  //       if (data.isLoggedIn) {
  //         console.log("User is logged in");
  //         return { isLoggedIn: data.isLoggedIn, user: data.user };
  //       } else {
  //         console.log("User is not logged in");
  //         return { isLoggedIn: false, user: undefined };
  //       }
  //     } else {
  //       console.log("User is not authenticated");
  //       return { isLoggedIn: false, user: undefined };
  //     }
  //   } catch (error) {
  //     console.error("Error checking login status:", error);
  //     return { isLoggedIn: false, user: undefined };
  //   }
  // }

  // const { isLoggedIn, user } = await checkLoginStatus();
  // console.log("USER_DATA: ", { isLoggedIn, user });

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

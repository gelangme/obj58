"use client";
import React from "react";
import {
  ConfigProvider,
  NavBar,
  Card,
  List,
  Button,
  Space,
  SideBar,
} from "antd-mobile";
import {
  FileTextOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  SettingFilled,
} from "@ant-design/icons";
import Link from "next/link";
import { Directory } from "@/utils/readFileData";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { isDarkModeAtom } from "@/state/atoms";
import { MenuProps } from "antd";

export default function AntdLayoutMobile({
  children,
  directory,
}: {
  children: React.ReactNode;
  directory: Directory;
}) {
  const { t } = useTranslation();
  const isDarkMode = useAtomValue(isDarkModeAtom);

  // const mapDirectoryToMenuItems = (
  //   directory: Directory,
  //   parentPath: string = ""
  // ): MenuProps["items"] => {
  //   const currentPath = parentPath
  //     ? `${parentPath}/${directory.dirName}`
  //     : directory.dirName;

  //   const subDirectories = directory.directories
  //     .map((subDir) => ({
  //       key: subDir.dirName,
  //       icon: React.createElement(FileTextOutlined),
  //       label: subDir.dirName,
  //       children: mapDirectoryToMenuItems(subDir, currentPath),
  //     }))
  //     .filter((subDir) => subDir.children && subDir.children.length > 0);

  //   const files = directory.files.map((file) => {
  //     const filePath = `${currentPath}/${file}`;
  //     const encodedFilePath = encodeURIComponent(filePath);
  //     console.log(encodedFilePath);
  //     console.log(`Navigating to /texts/${encodeURIComponent(filePath)}`);
  //     return {
  //       key: file.replace(".json", ""),
  //       icon: React.createElement(FileTextOutlined),
  //       label: (
  //         <Link
  //           href={`/texts/${encodeURIComponent(filePath).replace(".json", "")}`}
  //         >
  //           {file.replace(".json", "")}
  //         </Link>
  //         // <Link href={`/texts/kek`}>{file.replace(".json", "")}</Link>
  //       ),
  //     };
  //   });

  //   return [...subDirectories, ...files];
  // };

  const menuItems = [
    {
      key: "home",
      icon: React.createElement(HomeOutlined),
      label: <Link href="/">{t("home")}</Link>,
    },
    {
      key: "vocabulary",
      icon: React.createElement(FileTextOutlined),
      label: <Link href="/vocabulary">{t("vocabulary")}</Link>,
    },
    {
      key: "texts",
      icon: React.createElement(FileTextOutlined),
      label: t("texts"),
      // children: mapDirectoryToMenuItems(directory),
    },
    {
      key: "settings",
      label: (
        <Link className="h-[50px] w-full" href="/settings">
          {t("settings")}
        </Link>
      ),
      icon: React.createElement(SettingFilled),
    },
  ];

  return (
    <ConfigProvider>
      <div className="flex flex-row w-full h-full grow">
        <SideBar>
          {menuItems.map((item) => (
            <SideBar.Item className="" key={item.key} title={item.label} />
          ))}
        </SideBar>

        <Card
          style={{
            margin: "16px",
            padding: "16px",
            borderRadius: "12px",
            background: isDarkMode ? "#333" : "#f5f5f5",
          }}
        >
          {children}
        </Card>
      </div>
    </ConfigProvider>
  );
}

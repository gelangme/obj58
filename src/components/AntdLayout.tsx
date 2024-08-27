"use client";
import React, { useCallback, useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu, theme, Switch, Card } from "antd";
import {
  FileTextOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import Link from "next/link";
import { Directory } from "@/utils/readFileData";
import { useTranslation } from "react-i18next";
import { useAtomValue } from "jotai";
import { isDarkModeAtom } from "@/state/atoms";
import { useMediaQuery } from "react-responsive";

const { defaultAlgorithm, darkAlgorithm } = theme;
const { Sider } = Layout;

export default function AntdLayout({
  children,
  directory,
}: {
  children: React.ReactNode;
  directory: Directory;
}) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const isDarkMode = useAtomValue(isDarkModeAtom);

  const mapDirectoryToMenuItems = (
    directory: Directory,
    parentPath: string = ""
  ): MenuProps["items"] => {
    const currentPath = parentPath
      ? `${parentPath}/${directory.dirName}`
      : directory.dirName;

    const subDirectories = directory.directories
      .map((subDir) => ({
        key: subDir.dirName,
        icon: React.createElement(FileTextOutlined),
        label: subDir.dirName,
        children: mapDirectoryToMenuItems(subDir, currentPath),
      }))
      .filter((subDir) => subDir.children && subDir.children.length > 0);

    const files = directory.files.map((file) => {
      const filePath = `${currentPath}/${file}`;
      const encodedFilePath = encodeURIComponent(filePath);
      console.log(encodedFilePath);
      console.log(`Navigating to /texts/${encodeURIComponent(filePath)}`);
      return {
        key: file.replace(".json", ""),
        icon: React.createElement(FileTextOutlined),
        label: (
          <Link
            href={`/texts/${encodeURIComponent(filePath).replace(".json", "")}`}
          >
            {file.replace(".json", "")}
          </Link>
          // <Link href={`/texts/kek`}>{file.replace(".json", "")}</Link>
        ),
      };
    });

    return [...subDirectories, ...files];
  };

  // const [menuItems, setMenuItems] = useState<MenuProps["items"]>([
  //   {
  //     key: "home",
  //     icon: React.createElement(HomeOutlined),
  //     label: <Link href="/">{t("home")}</Link>,
  //   },
  //   {
  //     key: "generate-new-text",
  //     icon: React.createElement(PlayCircleOutlined),
  //     label: <Link href="/generate-new-text">{t("generate-new-text")}</Link>,
  //   },
  //   {
  //     key: "vocabulary",
  //     icon: React.createElement(FileTextOutlined),
  //     label: <Link href="/vocabulary">{t("vocabulary")}</Link>,
  //   },
  //   {
  //     key: "texts",
  //     icon: React.createElement(FileTextOutlined),
  //     label: t("texts"),
  //     children: mapDirectoryToMenuItems(directory),
  //   },
  //   {
  //     key: t("settings"),
  //     label: <Link href="/settings">{t("settings")}</Link>,
  //     icon: React.createElement(SettingFilled),
  //   },
  // ]);

  const menuItems: MenuProps["items"] = [
    {
      key: "home",
      icon: React.createElement(HomeOutlined),
      label: <Link href="/">{t("home")}</Link>,
    },
    {
      key: "generate-new-text",
      icon: React.createElement(PlayCircleOutlined),
      label: <Link href="/generate-new-text">{t("generate-new-text")}</Link>,
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
      children: mapDirectoryToMenuItems(directory),
    },
    {
      key: t("settings"),
      label: <Link href="/settings">{t("settings")}</Link>,
      icon: React.createElement(SettingFilled),
    },
  ];

  const handleMenuClick = ({ keyPath }: { keyPath: string[] }) => {
    console.log("handleMenuClick: ", { keyPath });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#009688",
          colorInfo: "#009688",
        },
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <StyleProvider hashPriority="high">
        <Layout>
          <Layout>
            <Sider
              style={{ background: colorBgContainer }}
              collapsedWidth={0}
              collapsible={isMobile}
              className={isMobile ? "!absolute !left-0 !z-50 h-full" : ""}
            >
              <Menu
                mode="inline"
                style={{ height: "100%", borderRight: 0 }}
                items={menuItems}
                onClick={handleMenuClick}
              />
            </Sider>
            <Layout style={{ padding: "24px 24px" }}>
              {/* <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Texts</Breadcrumb.Item>
                <Breadcrumb.Item>Text 1</Breadcrumb.Item>
              </Breadcrumb> */}
              <Card
                style={{
                  margin: 0,
                  minHeight: 280,
                  borderRadius: borderRadiusLG,
                }}
              >
                {children}
              </Card>
            </Layout>
          </Layout>
        </Layout>
      </StyleProvider>
    </ConfigProvider>
  );
}

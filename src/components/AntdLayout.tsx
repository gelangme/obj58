"use client";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import {
  ConfigProvider,
  Layout,
  Menu,
  theme,
  Select,
  Switch,
  Card,
} from "antd";
import {
  FileTextOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  GlobalOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import Link from "next/link";
import { Directory } from "@/utils/readFileData";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import i18nConfig from "../../i18nConfig";

const { defaultAlgorithm, darkAlgorithm } = theme;
const { Header, Content, Sider } = Layout;

export default function AntdLayout({
  children,
  directory,
}: {
  children: React.ReactNode;
  directory: Directory;
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { t, i18n } = useTranslation();

  const router = useRouter();
  const currentPathname = usePathname();

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

  const getIsDarkTheme = () => {
    const isDarkTheme = localStorage.getItem("isDarkTheme");
    if (isDarkTheme === null) {
      return false;
    } else {
      return JSON.parse(isDarkTheme);
    }
  };

  const [isDark, setIsDark] = useState<boolean>();

  console.log(isDark);

  // const changeLanguage = (lng) => {
  //   // i18n.changeLanguage(lng);
  //   router.push(router.pathname, router.asPath, { locale: lng });
  // };

  const handleLocaleChange = (value: any) => {
    const currentLocale = i18n.language;

    router.push(currentPathname.replace(`/${currentLocale}`, `/${value}`));

    router.refresh();
  };

  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([
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
      key: "settings",
      label: t("settings"),
      type: "group",
      children: [
        {
          key: "interface-language",
          label: (
            <div className="flex flex-row items-center justify-start gap-3">
              <Select
                className="w-full"
                defaultValue={i18n.language}
                onChange={handleLocaleChange}
                options={[
                  { value: "en", label: "english" },
                  { value: "de", label: "deutsch" },
                  { value: "uk", label: "українська" },
                ]}
              />
            </div>
          ),
          icon: <GlobalOutlined />,
        },
        {
          key: "interface-theme",
          label: (
            <div className="flex flex-row items-center justify-start gap-3">
              <span>{t("interface-theme")}</span>
              <Switch
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
                defaultChecked={isDark}
                onChange={(value) => {
                  console.log("Checked?: ", value);
                  setIsDark(value);
                  localStorage.setItem("isDarkTheme", JSON.stringify(value));
                }}
              />
            </div>
          ),
        },
      ],
    },
  ]);

  const handleMenuClick = ({ keyPath }: { keyPath: string[] }) => {
    console.log("handleMenuClick: ", { keyPath });
  };

  useEffect(() => {
    setIsDark(getIsDarkTheme);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#009688",
          colorInfo: "#009688",
        },
        algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <StyleProvider hashPriority="high">
        <Layout>
          <Layout>
            <Sider width={225} style={{ background: colorBgContainer }}>
              <Menu
                mode="inline"
                style={{ height: "100%", borderRight: 0 }}
                items={menuItems}
                onClick={handleMenuClick}
              />
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
              {/* <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Texts</Breadcrumb.Item>
                <Breadcrumb.Item>Text 1</Breadcrumb.Item>
              </Breadcrumb> */}
              <Card
                style={{
                  padding: 24,
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

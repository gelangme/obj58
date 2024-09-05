"use client";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import {
  ConfigProvider,
  Layout,
  Menu,
  theme,
  Switch,
  Card,
  Button,
  notification,
  Drawer,
  Space,
} from "antd";
import {
  FileTextOutlined,
  PlayCircleOutlined,
  HomeOutlined,
  SettingFilled,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
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

const MenuUnfoldIcon = React.createElement(MenuUnfoldOutlined);
const MenuFoldIcon = React.createElement(MenuFoldOutlined);

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
  const [isMobileSiderCollapsed, setIsMobileSiderCollapsed] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  let effectCounter = 0;

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
            href={`/texts/${encodeURIComponent(filePath)
              .replace(".json", "")
              .replace("data%2F", "")}`}
          >
            {file.replace(".json", "")}
          </Link>
          // <Link href={`/texts/kek`}>{file.replace(".json", "")}</Link>
        ),
      };
    });

    return [...subDirectories, ...files];
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "home",
      icon: React.createElement(HomeOutlined),
      label: <Link href="/">{t("home")}</Link>,
    },
    // {
    //   key: "generate-new-text",
    //   icon: React.createElement(PlayCircleOutlined),
    //   label: <Link href="/generate-new-text">{t("generate-new-text")}</Link>,
    // },
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

  const menuItemsMobile: MenuProps["items"] = [
    {
      key: "home",
      label: <Link href="/">{React.createElement(HomeOutlined)}</Link>,
    },
    {
      key: "vocabulary",
      label: (
        <Link href="/vocabulary">{React.createElement(FileTextOutlined)}</Link>
      ),
    },
    {
      key: "texts",
      label: <Link href="/texts">{React.createElement(FileTextOutlined)}</Link>,
    },
    {
      key: "settings",
      label: (
        <Link className="text-xl" href="/settings">
          {React.createElement(SettingFilled)}
        </Link>
      ),
    },
  ];

  const handleMenuClick = ({ keyPath }: { keyPath: string[] }) => {
    console.log("handleMenuClick: ", { keyPath });
  };

  useEffect(() => {
    if (effectCounter === 0) {
      effectCounter = effectCounter + 1;
      return;
    }
    const localStorageConsentString = localStorage.getItem(
      "localStorageConsent"
    );
    const localStorageConsentBoolean = localStorageConsentString
      ? JSON.parse(localStorageConsentString)
      : false;

    //todo: remove notification related code
    // if (!localStorageConsentBoolean && !isNotifShown) {
    //   setIsNotifShown(true);
    //   openNotification();
    // }

    if (!localStorageConsentBoolean) {
      setIsDrawerOpen(true);
    }
  });

  const renderMobileLayout = () => {
    return (
      <>
        <div className="fixed z-[1500] w-[100vw] bottom-0 h-[3rem] border-t-[1px] border-solid box-border border-x-gray-400 noselect">
          <Menu
            mode="horizontal"
            style={{ height: "100%" }}
            className="flex flex-row justify-center"
            items={menuItemsMobile}
            onClick={handleMenuClick}
          />
        </div>
        <Layout>
          <Layout>
            <Layout className="justify-between" style={{ padding: "12px" }}>
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
                className="card-padding"
              >
                {children}
              </Card>
              <Layout.Footer className="h-10 bottom-0 opacity-70">
                © {new Date().getFullYear()} gelang.me
              </Layout.Footer>
            </Layout>
          </Layout>
        </Layout>
      </>
    );
  };

  const renderDesktopLayout = () => {
    return (
      <Layout>
        <Layout>
          <Sider
            collapsed={false}
            style={{ background: colorBgContainer }}
            className="noselect"
          >
            <Menu
              mode="inline"
              style={{ height: "100%", borderRight: 0 }}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </Sider>
          <Layout
            className="justify-between"
            style={isMobile ? { padding: "12px" } : { padding: "24px" }}
          >
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
                padding: 24,
              }}
            >
              {children}
            </Card>
            <Layout.Footer className="h-10 bottom-0 opacity-70">
              © {new Date().getFullYear()} gelang.me
            </Layout.Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#009688",
          colorInfo: "#009688",
        },
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        components: {
          Drawer: {
            zIndexPopupBase: 3000,
          },
        },
      }}
    >
      <StyleProvider hashPriority="high">
        <Drawer
          title={t("cookies-title")}
          placement={"bottom"}
          height={200}
          onClose={() => setIsDrawerOpen(false)}
          closable={false}
          open={isDrawerOpen}
          maskClosable={false}
          extra={
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  localStorage.setItem(
                    "localStorageConsent",
                    JSON.stringify(true)
                  );
                  setIsDrawerOpen(false);
                }}
              >
                OK
              </Button>
            </Space>
          }
        >
          {t("cookies-body")}
        </Drawer>
        {isMobile ? renderMobileLayout() : renderDesktopLayout()}
        {contextHolder}
      </StyleProvider>
    </ConfigProvider>
  );
}

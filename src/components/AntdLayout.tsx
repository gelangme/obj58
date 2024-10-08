"use client";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import {
  ConfigProvider,
  Layout,
  Menu,
  theme,
  Card,
  Button,
  notification,
  Drawer,
  Space,
  Modal,
} from "antd";
import {
  FileTextOutlined,
  HomeOutlined,
  SettingFilled,
  LoginOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import Link from "next/link";
import { Directory } from "@/utils/readFileData";
import { useTranslation } from "react-i18next";
import { useAtom, useAtomValue } from "jotai";
import { isDarkModeAtom, isLoggedInAtom, userAtom } from "@/state/atoms";
import { useMediaQuery } from "react-responsive";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import UserProfile from "./UserProfile";
import { TextMenuItem, User } from "@/common/types";
import { useHydrateAtoms } from "jotai/utils";
import axios from "axios";

const { defaultAlgorithm, darkAlgorithm } = theme;
const { Sider } = Layout;

export default function AntdLayout({
  children,
  fetchedMenuItems,
}: {
  children: React.ReactNode;
  fetchedMenuItems: TextMenuItem[];
}) {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { t } = useTranslation();
  const isDarkMode = useAtomValue(isDarkModeAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/logout",
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Logout successful");
        setTimeout(() => window.location.reload(), 1000);
        setIsLoggedIn(false);
        setUser(undefined);
      } else {
        console.log("Logout is not successful");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggedIn(false);
      setUser(undefined);
    }
  };

  let effectCounter = 0;

  const menuItems: MenuProps["items"] = [
    {
      key: "home",
      icon: React.createElement(HomeOutlined),
      label: <Link href="/">{t("home")}</Link>,
    },
    {
      key: "vocabulary",
      icon: React.createElement(BookOutlined),
      label: <Link href="/vocabulary">{t("vocabulary")}</Link>,
    },
    {
      key: "texts",
      icon: React.createElement(FileTextOutlined),
      label: <Link href="/texts">{t("texts")}</Link>,
    },

    {
      key: "settings",
      label: <Link href="/settings">{t("settings")}</Link>,
      icon: React.createElement(SettingFilled),
    },
    isLoggedIn
      ? null
      : {
          key: "login",
          label: (
            <Link
              href="#"
              onClick={() => {
                setIsModalOpen(true);
                return false;
              }}
            >
              Log In
            </Link>
          ),
          icon: React.createElement(LoginOutlined),
        },
    isLoggedIn
      ? {
          key: "profile",
          label: <Link href="/profile">{t("profile")}</Link>,
          icon: React.createElement(SettingFilled),
        }
      : null,
    isLoggedIn
      ? {
          key: "logout",
          label: (
            <Link
              href="#"
              onClick={() => {
                logout();
                return false;
              }}
            >
              Log Out
            </Link>
          ),
          icon: React.createElement(LogoutOutlined),
          danger: true,
        }
      : null,
  ];

  const menuItemsMobile: MenuProps["items"] = [
    {
      key: "home",
      label: (
        <Link
          className="flex items-center justify-center h-full w-full"
          href="/"
        >
          <HomeOutlined style={{ fontSize: "20px" }} />
        </Link>
      ),
    },
    {
      key: "vocabulary",
      label: (
        <Link
          className="flex items-center justify-center h-full w-full"
          href="/vocabulary"
        >
          <BookOutlined style={{ fontSize: "20px" }} />
        </Link>
      ),
    },
    {
      key: "texts",
      label: (
        <Link
          className="flex items-center justify-center h-full w-full"
          href="/texts"
        >
          <FileTextOutlined style={{ fontSize: "20px" }} />
        </Link>
      ),
    },
    {
      key: "settings",
      label: (
        <Link
          className="flex items-center justify-center h-full w-full"
          href="/settings"
        >
          <SettingFilled style={{ fontSize: "20px" }} />
        </Link>
      ),
    },
    {
      key: "login",
      label: (
        <Link
          className="flex items-center justify-center h-full w-full"
          href="#"
          onClick={() => {
            setIsModalOpen(true);
            return false;
          }}
        >
          <LoginOutlined style={{ fontSize: "20px" }} />
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
  }, []);

  useEffect(() => {
    async function checkLoginStatus() {
      try {
        const response = await axios.get("http://localhost:3001/auth/check", {
          withCredentials: true,
        });

        if (response.status === 200) {
          const data = response.data;
          setIsLoggedIn(data.isLoggedIn);
          setUser(data.user);
        } else {
          console.log("User is not authenticated");
          setIsLoggedIn(false);
          setUser(undefined);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUser(undefined);
      }
    }

    checkLoginStatus();
  }, []);

  const renderMobileLayout = () => {
    return (
      <>
        <div className="fixed z-[1500] w-[100vw] bottom-0 h-[3rem] border-t-[1px] border-solid box-border border-x-gray-400 noselect">
          <Menu
            mode="horizontal"
            style={{ height: "100%" }}
            className="flex flex-row justify-center"
            items={menuItemsMobile}
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
              <Layout.Content
              // style={{
              //   margin: 0,
              //   minHeight: 280,
              //   borderRadius: borderRadiusLG,
              // }}
              // className="card-padding"
              >
                {children}
              </Layout.Content>
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
            <Layout.Content
            // style={{
            //   margin: 0,
            //   minHeight: 280,
            //   borderRadius: borderRadiusLG,
            //   padding: 24,
            // }}
            >
              {children}
            </Layout.Content>
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
        {isLoggingIn ? (
          <Modal
            title={t("log-in")}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <div className="flex flex-col gap-3">
              <Link
                className="mt-3 mb-3"
                href="#"
                onClick={() => {
                  setIsLoggingIn(false);
                  return false;
                }}
              >
                Don't have an account? Register here
              </Link>
              <LoginForm />
            </div>
          </Modal>
        ) : (
          <Modal
            title={t("sign-up")}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <div className="flex flex-col gap-3">
              <Link
                className="mt-3 mb-3"
                href="#"
                onClick={() => {
                  setIsLoggingIn(true);
                  return false;
                }}
              >
                Already have an account? Log In here
              </Link>
              <RegisterForm />
            </div>
          </Modal>
        )}
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
        {/* {isMobile ? renderMobileLayout() : renderDesktopLayout()} */}
        <div className="hidden md:flex min-h-[100vh] min-w-[100vw]">
          {renderDesktopLayout()}
        </div>
        <div className="flex md:hidden min-h-[100vh] min-w-[100vw]">
          {renderMobileLayout()}
        </div>
        {contextHolder}
      </StyleProvider>
    </ConfigProvider>
  );
}

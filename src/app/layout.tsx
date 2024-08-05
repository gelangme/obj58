"use client";
import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { MenuProps } from "antd";
import { App, ConfigProvider, Breadcrumb, Layout, Menu, theme } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import { readdirSync } from "fs";
import path from "path";
const { defaultAlgorithm, darkAlgorithm } = theme;

const { Header, Content, Sider } = Layout;
const inter = Inter({ subsets: ["latin"] });

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps["items"] = [
  {
    key: `generate`,
    icon: React.createElement(PlayCircleOutlined),
    label: `Generate new text`,
  },
  {
    key: `texts`,
    icon: React.createElement(FileTextOutlined),
    label: `Available texts`,
    children: [
      {
        key: `text-1`,
        label: `Text 1`,
      },
    ],
  },
];

// const generateLinks = () => {
//   const directoryPath = path.join(__dirname, "/data/");
//   console.log(directoryPath);
//   const fileNames = [];
//   const files = readdirSync(directoryPath);
//   files.forEach(function (file) {
//     fileNames.push(file.substring(0, file.indexOf(".")));
//   });
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <html lang="en">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#009688",
              colorInfo: "#009688",
            },
            algorithm: defaultAlgorithm,
          }}
        >
          <StyleProvider hashPriority="high">
            <Layout>
              <Layout>
                <Sider width={200} style={{ background: colorBgContainer }}>
                  <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    style={{ height: "100%", borderRight: 0 }}
                    items={items2}
                  />
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }}>
                  <Breadcrumb style={{ margin: "16px 0" }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Texts</Breadcrumb.Item>
                    <Breadcrumb.Item>Text 1</Breadcrumb.Item>
                  </Breadcrumb>
                  <Content
                    style={{
                      padding: 24,
                      margin: 0,
                      background: colorBgContainer,
                      borderRadius: borderRadiusLG,
                    }}
                  >
                    {children}
                  </Content>
                </Layout>
              </Layout>
            </Layout>
          </StyleProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}

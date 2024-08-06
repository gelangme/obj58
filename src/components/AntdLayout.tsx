"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { MenuProps } from "antd";
import { ConfigProvider, Breadcrumb, Layout, Menu, theme } from "antd";
import {
  FileTextOutlined,
  PlayCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import Link from "next/link";

const { defaultAlgorithm, darkAlgorithm } = theme;
const { Header, Content, Sider } = Layout;

export default function AntdLayout({
  children,
  filenames,
  testfiles,
}: {
  children: React.ReactNode;
  filenames: string[];
  testfiles: string[];
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  console.log("FILES FileNames: ", filenames);
  console.log("FILES TestFiles: ", testfiles);

  const pathname = usePathname();
  console.log("pathname: ", pathname);

  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([
    {
      key: `home`,
      icon: React.createElement(HomeOutlined),
      label: <Link href={"/"}>Home</Link>,
    },
    {
      key: `generate-new-text`,
      icon: React.createElement(PlayCircleOutlined),
      label: <Link href={"/generate-new-text"}>Generate new text</Link>,
    },
    {
      key: `vocabulary`,
      icon: React.createElement(FileTextOutlined),
      label: <Link href={"/vocabulary"}>Your vocabulary</Link>,
    },
    {
      key: `texts`,
      icon: React.createElement(FileTextOutlined),
      label: `Available texts`,
      children: filenames.map((item) => {
        const itemName = item.replace(".json", "");
        return {
          key: itemName,
          label: <Link href={`/texts/${itemName}`}>{itemName}</Link>,
        };
      }),
    },
  ]);

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
        algorithm: defaultAlgorithm,
      }}
    >
      <StyleProvider hashPriority="high">
        <Layout>
          <Layout>
            <Sider width={200} style={{ background: colorBgContainer }}>
              <Menu
                mode="inline"
                style={{ height: "100%", borderRight: 0 }}
                items={menuItems}
                onClick={handleMenuClick}
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
  );
}

import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { MenuProps } from "antd";
import { ConfigProvider, Breadcrumb, Layout, Menu, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { FileTextOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { StyleProvider } from "@ant-design/cssinjs";
import AntdLayout from "@/components/AntdLayout";
import { getJsonFilenames, getJsonFiles } from "@/utils/readFileData";

const { defaultAlgorithm, darkAlgorithm } = theme;

const { Header, Content, Sider } = Layout;
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const filenames = getJsonFilenames();
  const testfiles = getJsonFiles();

  return (
    <html lang="en">
      <body className={inter.className + " flex min-h-screen flex-col"}>
        <AntdRegistry>
          <AntdLayout testfiles={testfiles} filenames={filenames}>
            {children}
          </AntdLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}

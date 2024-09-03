"use client";
import React, { useEffect, useState } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdLayout from "@/components/AntdLayout";
import { Directory } from "@/utils/readFileData";
import TranslationsProvider from "@/components/TranslationsProvider";
import { useMediaQuery } from "react-responsive";
import AntdLayoutMobile from "@/components/AntdLayoutMobile";

export default function LayoutSwitch({
  children,
  directory,
}: {
  children: React.ReactNode;
  directory: Directory;
}) {
  return false ? (
    <AntdLayoutMobile directory={directory}>{children}</AntdLayoutMobile>
  ) : (
    <AntdRegistry>
      <AntdLayout directory={directory}>{children}</AntdLayout>
    </AntdRegistry>
  );
}

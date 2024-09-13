"use client";

import { Divider, List } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Directory } from "@/utils/readFileData";
import Link from "next/link";
import { TextMenuItem } from "@/common/types";

export default function TextsPageClient({
  menuItems,
}: {
  menuItems: TextMenuItem[];
}) {
  return (
    <List
      itemLayout="horizontal"
      dataSource={menuItems}
      renderItem={(item, index) => (
        <>
          <Link href={`/texts/${encodeURIComponent(item.textID)}`}>
            <List.Item>
              <List.Item.Meta
                avatar={React.createElement(FileTextOutlined)}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          </Link>
          <Divider />
        </>
      )}
    />
  );
}

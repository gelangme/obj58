"use client";

import { List } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Directory } from "@/utils/readFileData";
import Link from "next/link";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

export default function TextsPageClient({
  directory,
}: {
  directory: Directory;
}) {
  const [listData, setListData] = useState<{ title: string }[] | undefined>(
    undefined
  );

  const getAllFiles = (directory: Directory): string[] => {
    let filesList: string[] = [...directory.files];

    for (const subDirectory of directory.directories) {
      filesList = filesList.concat(getAllFiles(subDirectory));
    }

    return filesList;
  };

  useEffect(() => {
    const allFiles = getAllFiles(directory);
    const newListData = allFiles.map((item) => ({ title: item }));
    setListData(newListData);
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={listData}
      renderItem={(item, index) => (
        <Link
          href={`/texts/${encodeURIComponent(item.title).replace(".json", "")}`}
        >
          <List.Item>
            <List.Item.Meta
              avatar={React.createElement(FileTextOutlined)}
              title={item.title.replace(".json", "")}
              description="Placeholder for future text desctiptions"
            />
          </List.Item>
        </Link>
      )}
    />
  );
}

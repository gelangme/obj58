import TextsPageClient from "@/components/TextsPageClient";
import TextsPageClientNoStatic from "@/components/TextsPageClientNoStatic";
import { Divider } from "antd";

import axios from "axios";

export default async function TextsPage() {
  const menuData = await axios.get("http://localhost:3001/menu");
  const menuItems = await menuData.data;
  console.log("menuItems: ", { menuItems });

  return (
    <>
      <TextsPageClient menuItems={menuItems} />
      No static menu:
      <TextsPageClientNoStatic menuItems={menuItems} />
    </>
  );
}

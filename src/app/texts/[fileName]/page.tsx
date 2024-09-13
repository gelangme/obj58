import FilePageClient from "@/components/FilePageClient";
import { getJsonContent, getJsonFilenames } from "@/utils/readFileData";
import axios from "axios";

export async function generateStaticParams() {
  // const menuData = await axios.get("http://localhost:3001/menu");
  // const menuItems = await menuData.data;
  // const updatedFileNames = menuItems.map((item: any) => ({
  //   fileName: item.id,
  // }));
  // console.log("menuItems: ", { menuItems });
  // console.log("UPDATED_FILE_NAMES: ", updatedFileNames);
  // return updatedFileNames;

  return [
    { fileName: "66e1ef3124a0724c23648694" },
    { fileName: "66e1ef3424a0724c23648695" },
  ];
}

export default async function FilePage({
  params,
}: {
  params: { fileName: string };
}) {
  const fileContent = await axios.get(
    `http://localhost:3001/text?textID=${params.fileName}`
  );
  console.log("PARAMS: ", params);

  return (
    <FilePageClient
      text={fileContent.data.text}
      videoLink={fileContent.data.videoLink}
    ></FilePageClient>
  );
}

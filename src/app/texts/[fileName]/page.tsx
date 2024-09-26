import FilePageClient from "@/components/FilePageClient";
import { getJsonContent, getJsonFilenames } from "@/utils/readFileData";
import axios from "axios";

// export async function generateStaticParams() {
//   // const menuData = await axios.get("http://localhost:3001/menu");
//   // const menuItems = await menuData.data;
//   // const updatedFileNames = menuItems.map((item: any) => ({
//   //   fileName: item.id,
//   // }));
//   // console.log("menuItems: ", { menuItems });
//   // console.log("UPDATED_FILE_NAMES: ", updatedFileNames);
//   // return updatedFileNames;

//   return [
//     { fileName: "66f52e3a826a7e64c120c1e4" },
//     { fileName: "66f53212826a7e64c120c1e6" },
//   ];
// }

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

import FilePageClient from "@/components/FilePageClient";
import { getJsonContent, getJsonFilenames } from "@/utils/readFileData";

export async function generateStaticParams() {
  const fileNames = getJsonFilenames();
  const updatedFileNames = fileNames.map((item) => ({
    fileName: item.replace(".json", ""),
  }));
  console.log("UPDATED_FILE_NAMES: ", updatedFileNames);
  return updatedFileNames;
}

// export async function generateStaticParams() {
//   return [{ fileName: "1" }];
// }

export default async function FilePage({
  params,
}: {
  params: { fileName: string };
}) {
  const fileContent = getJsonContent(
    `${decodeURIComponent(`data%2F${params.fileName}`)}.json`
  );

  console.log("PARAMS: ", params);

  return (
    <FilePageClient
      text={fileContent.Text}
      videoLink={fileContent.videoLink ? fileContent.videoLink : null}
    ></FilePageClient>
  );
}

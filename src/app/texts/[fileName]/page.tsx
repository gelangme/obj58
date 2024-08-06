import { iSentence } from "@/common/types";
import MainText from "@/components/MainText";
import { getJsonFilenames, getJsonContent } from "@/utils/readFileData";

export default function FilePage({ params }: { params: { fileName: string } }) {
  const fileContent = getJsonContent(decodeURIComponent(`${params.fileName}`));

  return <MainText text={fileContent.Text}></MainText>;
}

export async function generateStaticParams() {
  const fileNames = getJsonFilenames();
  return fileNames.map((file) => ({
    file: file.replace(".json", ""),
  }));
}

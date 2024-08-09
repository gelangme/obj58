import initTranslations from "@/app/i18n";
import { iSentence } from "@/common/types";
import MainText from "@/components/MainText";
import { getJsonFilenames, getJsonContent } from "@/utils/readFileData";
import { Select } from "antd";

const i18nNamespaces = ["main"];

export default async function FilePage({
  params,
}: {
  params: { fileName: string; locale: string };
}) {
  const fileContent = getJsonContent(
    `${decodeURIComponent(params.fileName)}.json`
  );

  return <MainText text={fileContent.Text}></MainText>;
}

export async function generateStaticParams() {
  const fileNames = getJsonFilenames();
  return fileNames.map((file) => ({
    file: file.replace(".json", ""),
  }));
}

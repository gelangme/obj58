import initTranslations from "@/app/i18n";
import { iSentence } from "@/common/types";
import MainText from "@/components/TextPage";
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

  console.log("PARAMS: ", params);

  return (
    <MainText
      text={fileContent.Text}
      videoLink={fileContent.videoLink ? fileContent.videoLink : null}
    ></MainText>
  );
}

export async function generateStaticParams() {
  const fileNames = getJsonFilenames();
  return fileNames.map((file) => ({
    file: file.replace(".json", ""),
  }));
}

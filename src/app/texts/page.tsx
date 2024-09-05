import TextsPageClient from "@/components/TextsPageClient";
import {
  getJsonContent,
  getJsonFilenames,
  getJsonFiles,
} from "@/utils/readFileData";

export default async function TextsPage() {
  const directory = getJsonFiles();

  return <TextsPageClient directory={directory} />;
}

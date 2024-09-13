import FilePageClient from "@/components/FilePageClient";
import axios from "axios";

export default async function FilePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  //   const fileContent = await axios.get(
  //     `http://localhost:3001/text?textID=${params.fileName}`
  //   );

  //   return (
  //     <FilePageClient
  //       text={fileContent.data.text}
  //       videoLink={fileContent.data.videoLink}
  //     ></FilePageClient>
  //   );

  return <div>{JSON.stringify(searchParams)}</div>;
}

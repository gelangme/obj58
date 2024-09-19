"use client";

import { iSentence } from "@/common/types";
import FilePageClient from "@/components/FilePageClient";
import axios from "axios";
import { useAtomValue } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientTextPage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState<iSentence[] | null>(null);
  const [videoLink, setVideoLink] = useState<string>("");

  useEffect(() => {
    const fetchText = async () => {
      try {
        const fileContent = await axios.get(
          `http://localhost:3001/text?textID=${textID}`
        );
        setText(fileContent.data.text);
        setVideoLink(fileContent.data.videoLink);
      } catch (error) {
        console.error("Failed to fetch text:", error);
      }
    };
    const textID = searchParams.get("textID");

    if (textID) {
      fetchText();
    }
  }, []);

  return text ? (
    <FilePageClient text={text} videoLink={videoLink} />
  ) : (
    <span>Loading...</span>
  );
}

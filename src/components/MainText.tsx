"use client";
import { iSentence } from "@/common/types";
import Sentence from "./Sentence";
import { Card } from "antd";

export default function MainText({ text }: { text: iSentence[] }) {
  return (
    <>
      {text.map((item) => (
        <Sentence sentence={item} />
      ))}
    </>
  );
}

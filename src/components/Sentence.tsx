import { iSentence } from "@/common/types";
import { Card } from "antd";
import Word from "./Word";
const str_space = " ";

export default function Sentence({ sentence }: { sentence: iSentence }) {
  return (
    <div className="mb-4">
      <div>
        {sentence.words.map((item) => (
          <>
            <Word word={item} />
            <span>{str_space}</span>
          </>
        ))}
      </div>
      <span className="opacity-60" title="Translation">
        {sentence.translation}
      </span>
    </div>
  );
}

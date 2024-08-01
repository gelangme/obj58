import { iSentence } from "@/common/types";
import Word from "./Word";
const ignor_words = [".", ",", "?", "!", ":", ")"]; // Array of symbols and words which are not higlighted

export default function Sentence({ sentence }: { sentence: iSentence }) {
  return (
    <div className="mb-4">
      {sentence.type === "h2" ? (
        <h2 className="text-2xl font-bold">
          {sentence.words.map((item, item_index) => {
            const isIgnored = ignor_words.includes(item.inf);
            return (
              <span key={item_index}>
                <Word word={item} noTooltip={isIgnored} whiteSpace={item_index !== 0 && !isIgnored} />
              </span>
            );
          })}
        </h2>
      ) : (
        <span>
          {sentence.words.map((item, item_index) => {
            const isIgnored = ignor_words.includes(item.inf);
            return (
              <span key={item_index}>
                <Word word={item} noTooltip={isIgnored} whiteSpace={item_index !== 0 && !isIgnored} />
              </span>
            );
          })}
        </span>
      )}
      <div className="opacity-10 hover:opacity-50 transition-opacity duration-300" title="Translation">
        {sentence.translation}
      </div>
    </div>
  );
}

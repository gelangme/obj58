import { iSentence } from "@/common/types";
import Word from "./Word";
import { Button } from "antd";
import React, { useState } from "react";
const ignor_words = [".", ",", "?", "!", ":", ")"]; // Array of symbols and words which are not higlighted
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

export default function Sentence({ sentence }: { sentence: iSentence }) {
  const playIcon = React.createElement(PlayCircleOutlined);
  const pauseIcon = React.createElement(PauseCircleOutlined);
  const [isPlaying, setIsPlaying] = useState(false);
  const sentenceString = sentence.words.reduce(
    (accumulator, currentValue) => accumulator + currentValue.original,
    ""
  );

  const playSentence = () => {
    console.log("uttarance");
    console.log(sentence.original);

    const utterance = new SpeechSynthesisUtterance(sentenceString);
    speechSynthesis.speak(utterance);
  };

  const pauseSentence = () => {
    // speechSynthesis.speak();
  };

  return (
    <div className="mb-4 flex flex-row">
      <div className="flex flex-col justify-center items-center mr-2">
        <Button type="text" onClick={playSentence}></Button>
      </div>
      <div className="flex flex-col">
        {sentence.type === "h2" ? (
          <h2 className="text-2xl font-bold">
            {sentence.words.map((item, item_index) => {
              const isIgnored = ignor_words.includes(item.inf);
              return (
                <span key={item_index}>
                  <Word
                    word={item}
                    noTooltip={isIgnored}
                    whiteSpace={item_index !== 0 && !isIgnored}
                  />
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
                  <Word
                    word={item}
                    noTooltip={isIgnored}
                    whiteSpace={item_index !== 0 && !isIgnored}
                  />
                </span>
              );
            })}
          </span>
        )}
        <div
          className="opacity-10 hover:opacity-50 transition-opacity duration-300"
          title="Translation"
        >
          {sentence.translation}
        </div>
      </div>
    </div>
  );
}

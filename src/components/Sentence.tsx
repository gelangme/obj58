import { iSentence } from "@/common/types";
import Word from "./Word";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
const ignor_words = [".", ",", "?", "!", ":", ")"]; // Array of symbols and words which are not higlighted
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

export default function Sentence({ sentence }: { sentence: iSentence }) {
  const playIcon = React.createElement(PlayCircleOutlined);
  const pauseIcon = React.createElement(PauseCircleOutlined);
  const [isPlaying, setIsPlaying] = useState(false);
  const sentenceString = sentence.words.reduce(
    (accumulator, currentValue) => accumulator + currentValue.original + " ",
    ""
  );

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();

  useEffect(() => {
    console.log("Voices: ", voices);
  }, [voices]);

  useEffect(() => {
    setTimeout(() => {
      setVoices(window.speechSynthesis.getVoices());
    }, 200);
  }, []);

  const handlePlay = async () => {
    // speechSynthesis.cancel();
    // setIsPlaying(true);
    // await playSentence();
    // setIsPlaying(false);
  };

  const playSentence = () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentenceString);
    if (voices) {
      utterance.voice = voices[3];
    }
    speechSynthesis.speak(utterance);

    return new Promise((resolve) => {
      utterance.onend = resolve;
    });
  };

  const pauseSentence = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  return (
    <div className="mb-4 flex flex-row [&_button]:opacity-0 [&_button]:hover:opacity-100">
      <div className="flex flex-col justify-center items-center mr-3">
        {isPlaying ? (
          <Button
            className="text-6xl"
            onClick={() => {
              pauseSentence();
            }}
          >
            {pauseIcon}
          </Button>
        ) : (
          <Button
            className="text-6xl"
            onClick={() => {
              handlePlay();
            }}
          >
            {playIcon}
          </Button>
        )}
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

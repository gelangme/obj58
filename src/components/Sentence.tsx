"use client";
import { iSentence } from "@/common/types";
import Word from "./Word";
import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
const ignor_words = [".", ",", "?", "!", ":", ")"]; // Array of symbols and words which are not higlighted
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { translationLocaleAtom } from "@/state/atoms";
import { useMediaQuery } from "react-responsive";
import Link from "next/link";

const playIcon = React.createElement(PlayCircleOutlined);
const pauseIcon = React.createElement(PauseCircleOutlined);

export default function Sentence({ sentence }: { sentence: iSentence }) {
  if (!sentence.type) {
    sentence.type = "default";
  }
  const { i18n, t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [isPlaying, setIsPlaying] = useState(false);
  const sentenceString = sentence
    ? sentence.words.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.original + " ",
        ""
      )
    : "";

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [modal, contextHolder] = Modal.useModal();
  const [translation, setTranslation] = useState<string | null>(null);
  const [isSpeechSynthAvailable, setIsSpeechSynthAvailable] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const translationLocale = useAtomValue(translationLocaleAtom);

  useEffect(() => {
    console.log("Voices: ", voices);
  }, [voices]);

  const getTranslation = (language: string) => {
    if (sentence) {
      switch (language) {
        case "en":
          return sentence.enTranslation;
        case "uk":
          return sentence.ukTranslation;
        default:
          return sentence.enTranslation;
      }
    } else {
      console.log(
        "No translation found. Returning empty string as translation"
      );
      return "";
    }
  };

  const initTranslation = () => {
    const lang = searchParams.get("lang");
    if (lang) {
      return setTranslation(getTranslation(lang));
    }

    if (translationLocale === "default") {
      return setTranslation(getTranslation(i18n.language));
    } else {
      return setTranslation(getTranslation(translationLocale));
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const germanVoices = window.speechSynthesis
        .getVoices()
        .filter((x) => x.lang == "de-DE");

      const localGermanVoices = germanVoices.filter(
        (x) => x.localService === true
      );
      if (localGermanVoices.length !== 0) {
        setVoices(localGermanVoices);
        setIsSpeechSynthAvailable(true);
      } else {
        /* todo: add new string to i18nexus */
        Modal.destroyAll();
        modal.warning({
          title: t("warning"),
          content: t("warning-speech"),
        });
        setVoices(germanVoices);
        setIsSpeechSynthAvailable(false);
      }
    }, 200);
  }, []);

  useEffect(() => {
    initTranslation();
  }, [translationLocale, i18n]);

  const playSentence = () => {
    setIsPlaying(true);
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(sentenceString);
    if (voices) {
      utterance.voice = voices[0];
    }
    speechSynthesis.speak(utterance);
    utterance.onend = (event) => setIsPlaying(false);
  };

  const pauseSentence = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const rendersentenceonent = () => {
    if (sentence.hasOwnProperty("type")) {
      const { type } = sentence;
      switch (type) {
        case "h2":
          return (
            <>
              <h2>
                {sentence?.words.map((item, item_index) => {
                  const isIgnored = ignor_words.includes(item.inf);
                  return (
                    <span key={item_index}>
                      <Word
                        word={item}
                        noTooltip={isIgnored}
                        whiteSpace={item_index !== 0 && !isIgnored}
                        className="text-2xl font-bold"
                      />
                    </span>
                  );
                })}
              </h2>
              <div
                className="opacity-10 hover:opacity-50 transition-opacity duration-300"
                title="Translation"
              >
                {translation}
              </div>
            </>
          );
        case "noTranslation":
          return (
            <h2>
              {sentence?.words.map((item, item_index) => {
                const isIgnored = ignor_words.includes(item.inf);
                return (
                  <span key={item_index}>
                    <Word
                      word={item}
                      noTooltip={true}
                      whiteSpace={item_index !== 0 && !isIgnored}
                      className="text-base"
                    />
                  </span>
                );
              })}
            </h2>
          );
        case "default":
          return (
            <>
              <span>
                {sentence?.words.map((item, item_index) => {
                  const isIgnored = ignor_words.includes(item.inf);
                  return (
                    <span key={item_index}>
                      <Word
                        word={item}
                        noTooltip={isIgnored}
                        whiteSpace={item_index !== 0 && !isIgnored}
                        className="text-base"
                      />
                    </span>
                  );
                })}
              </span>
              <div
                className="opacity-10 hover:opacity-50 transition-opacity duration-300"
                title="Translation"
              >
                {translation}
              </div>
            </>
          );
        case "space":
          return <div className="mt-4 mb-4"></div>;
        default:
          <span>Something went wrong</span>;
          break;
      }
    }
  };

  const isRenderingSynthBttns = () => {
    if (isSpeechSynthAvailable) {
      if (
        sentence.type === "default" ||
        sentence.type === "h2" ||
        sentence.type === "noTranslation"
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="mb-4 flex flex-row [&_button]:opacity-100 md:[&_button]:opacity-0 md:[&_button]:hover:opacity-100">
      {contextHolder}
      <div className="flex flex-col justify-center items-center mr-3">
        {isRenderingSynthBttns() ? (
          isPlaying ? (
            <Button
              size={isMobile ? "small" : "middle"}
              type={isMobile ? "text" : "default"}
              onClick={() => {
                pauseSentence();
              }}
            >
              {pauseIcon}
            </Button>
          ) : (
            <Button
              size={isMobile ? "small" : "middle"}
              type={isMobile ? "text" : "default"}
              onClick={() => {
                playSentence();
              }}
            >
              {playIcon}
            </Button>
          )
        ) : null}
      </div>
      <div className="flex flex-col">{rendersentenceonent()}</div>
    </div>
  );
}

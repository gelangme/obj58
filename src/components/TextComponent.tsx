"use client";
import { iSentence, iTextComponent } from "@/common/types";
import Word from "./Word";
import { Button, Card, Checkbox, Image, Modal } from "antd";
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

export default function TextComponent({
  sentence,
}: {
  sentence: iTextComponent;
}) {
  const { i18n, t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [isPlaying, setIsPlaying] = useState(false);

  const isDataOfiSentenceType =
    sentence.type === "default" ||
    sentence.type === "noTranslation" ||
    sentence.type === "h2" ||
    sentence.type === "quote";

  const sentenceString = isDataOfiSentenceType
    ? sentence.data.words.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.original + " ",
        ""
      )
    : "";

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>();
  const [modal, contextHolder] = Modal.useModal();
  const [translation, setTranslation] = useState<string | null>(null);
  const [listTranslations, setListTranslations] = useState<
    (string | null)[] | null
  >(null);

  const [isSpeechSynthAvailable, setIsSpeechSynthAvailable] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const translationLocale = useAtomValue(translationLocaleAtom);

  useEffect(() => {
    console.log("Voices: ", voices);
  }, [voices]);

  const getTranslation = (language: string) => {
    console.log("Getting translation...");
    if (
      sentence.type === "default" ||
      sentence.type === "h2" ||
      sentence.type === "quote"
    ) {
      switch (language) {
        case "en":
          return sentence.data.enTranslation;
        case "uk":
          return sentence.data.ukTranslation;
        default:
          return sentence.data.enTranslation;
      }
    } else {
      console.log(
        "No translation found. Returning empty string as translation"
      );
      return "";
    }
  };

  const getListTranslations = (language: string) => {
    if (sentence.type === "list" || sentence.type === "checklist") {
      switch (language) {
        case "en":
          return sentence.data.map((item) => item.enTranslation);
        case "uk":
          return sentence.data.map((item) => item.ukTranslation);
        default:
          return sentence.data.map((item) => item.enTranslation);
      }
    } else {
      console.log(
        "No translation found. Returning empty string as translation"
      );
      return Array.apply(null, Array(5)).map(() => null);
    }
  };

  const initTranslation = () => {
    const lang = searchParams.get("lang");
    if (isDataOfiSentenceType) {
      if (lang) {
        return setTranslation(getTranslation(lang));
      }

      if (translationLocale === "default") {
        return setTranslation(getTranslation(i18n.language));
      } else {
        return setTranslation(getTranslation(translationLocale));
      }
    } else if (sentence.type === "list" || sentence.type === "checklist") {
      if (lang) {
        return setListTranslations(getListTranslations(lang));
      }

      if (translationLocale === "default") {
        return setListTranslations(getListTranslations(i18n.language));
      } else {
        return setListTranslations(getListTranslations(translationLocale));
      }
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

  const rendersentence = () => {
    if (sentence.hasOwnProperty("type")) {
      const { type } = sentence;
      switch (type) {
        case "h2":
          return (
            <>
              <h2>
                {sentence.data.words.map((item, item_index) => {
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
              {sentence.data.words.map((item, item_index) => {
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
                {sentence.data.words.map((item, item_index) => {
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
        case "quote":
          return (
            <>
              <Card className="flex flex-col">
                <span className="italic">
                  "
                  {sentence.data.words.map((item, item_index) => {
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
                  "
                </span>
                <div
                  className="opacity-10 hover:opacity-50 transition-opacity duration-300"
                  title="Translation"
                >
                  {translation}
                </div>
              </Card>
            </>
          );
        case "space":
          return <div className="mt-4 mb-4"></div>;
        case "list":
          return (
            <ul className="list-disc">
              {sentence.data.map((item, sentence_i) => (
                <>
                  <li>
                    <span>
                      {sentence.data[sentence_i].words.map(
                        (item, item_index) => {
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
                        }
                      )}
                    </span>
                  </li>
                  <div
                    className="opacity-10 hover:opacity-50 transition-opacity duration-300"
                    title="Translation"
                  >
                    {listTranslations ? listTranslations[sentence_i] : null}
                  </div>
                </>
              ))}
            </ul>
          );
        case "checklist":
          return (
            <div className="flex flex-col gap-2">
              {sentence.data.map((item, sentence_i) => (
                <>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <Checkbox />
                    <span>
                      {sentence.data[sentence_i].words.map(
                        (item, item_index) => {
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
                        }
                      )}
                    </span>
                  </div>
                  <div
                    className="opacity-10 hover:opacity-50 transition-opacity duration-300"
                    title="Translation"
                  >
                    {listTranslations ? listTranslations[sentence_i] : null}
                  </div>
                </>
              ))}
            </div>
          );
        case "image":
          return (
            <Image
              width={isMobile ? undefined : "500px"}
              src={`${process.env.NEXT_PUBLIC_BACK_URL}/${sentence.data}`}
            />
          );
        default:
          <span>Something went wrong</span>;
          break;
      }
    }
  };

  const isRenderingSynthBttns = () => {
    if (isSpeechSynthAvailable) {
      if (isDataOfiSentenceType) {
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
      <div className="flex flex-col">{rendersentence()}</div>
    </div>
  );
}

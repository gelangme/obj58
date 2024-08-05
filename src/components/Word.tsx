"use client";
import { iWord } from "@/common/types";
import { Button, Tooltip } from "antd";
import React, { useState } from "react";
import { PlusOutlined, CheckOutlined } from "@ant-design/icons";
import { json } from "stream/consumers";

interface iWordComponent {
  word: iWord;
  noTooltip?: boolean;
  whiteSpace?: boolean;
}

const plusIcon = React.createElement(PlusOutlined);
const checkIcon = React.createElement(CheckOutlined);

export default function Word({ word, noTooltip, whiteSpace }: iWordComponent) {
  const checkIfAddedToVocab = () => {
    const vocab = localStorage.getItem("vocab");
    console.log("Vocab: ", vocab);
    if (vocab) {
      const filteredVocab = JSON.parse(vocab).filter(
        (item: any) => item === word.inf
      );
      if (filteredVocab.length !== 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const [isAddedToVocab, setIsAddedToVocab] = useState(checkIfAddedToVocab());

  const addToVocab = () => {
    setIsAddedToVocab(true);

    const vocab = localStorage.getItem("vocab");

    if (vocab) {
      const newVocab = JSON.parse(vocab);
      newVocab.push(word.inf);

      return localStorage.setItem("vocab", JSON.stringify(newVocab));
    }

    const newVocab = [word.inf];
    localStorage.setItem("vocab", JSON.stringify(newVocab));
  };

  return noTooltip ? (
    <span>{word.original}</span>
  ) : (
    <Tooltip
      title={
        <div className="flex flex-row gap-1 items-center">
          {isAddedToVocab ? (
            <CheckOutlined />
          ) : (
            <PlusOutlined onClick={addToVocab} />
          )}
          <span>{word.t}</span>
        </div>
      }
      mouseEnterDelay={0}
    >
      {whiteSpace && " "}
      <span className="hover:bg-slate-400 cursor-pointer">{word.original}</span>
    </Tooltip>
  );
}

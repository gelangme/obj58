import { iWord } from "@/common/types";
import { Tooltip } from "antd";

interface iWordComponent {
  word: iWord;
  noTooltip?: boolean;
  whiteSpace?: boolean;
}


export default function Word({ word, noTooltip, whiteSpace }: iWordComponent) {
  return noTooltip ? (
    <span>{word.original}</span>
  ) : (
    <Tooltip title={word.t} mouseEnterDelay={0}>
      <span className="hover:bg-slate-400 cursor-pointer">{whiteSpace && " "}{word.original}</span>
    </Tooltip>
  );
}

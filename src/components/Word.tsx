import { iWord } from "@/common/types";
import { Tooltip } from "antd";

export default function Word({ word }: { word: iWord }) {
  return (
    <Tooltip title={word.translation}>
      <span className="hover:bg-slate-400 cursor-pointer">{word.original}</span>
    </Tooltip>
  );
}

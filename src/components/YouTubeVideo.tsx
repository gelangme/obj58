"use client";
import { Button, Form, Input } from "antd";
// ts
import React, { useEffect, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default function YouTubeVideo({ videoLink }: { videoLink: string }) {
  const [videoId, setVideoId] = useState<string | undefined>();
  const [size, setSize] = useState({ height: "390", width: "640" });

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: size.height,
    width: size.width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const youtube_parser = (url: string) => {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : undefined;
  };

  useEffect(() => {
    setVideoId(youtube_parser(videoLink));
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />
        <div className="flex flex-row justify-center gap-4">
          <Button
            type="default"
            onClick={() => setSize({ height: "195", width: "320" })}
          >
            Small
          </Button>
          <Button
            type="default"
            onClick={() => setSize({ height: "240", width: "426" })}
          >
            Medium
          </Button>
          <Button
            type="default"
            onClick={() => setSize({ height: "390", width: "640" })}
          >
            Big
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

type VideoDetails = {
  previewUrl: string;
  title: string;
  author: string;
};

const loadVideoDetails = (id: string): Promise<VideoDetails> => {
  return new Promise((resolve): void => {
    setTimeout(
      () =>
        resolve({
          previewUrl: "https://i.ytimg.com/vi/BlNwQdqdRig/hqdefault.jpg",
          title: "Functional TypeScript: curry function",
          author: "@AleksandrSugak",
        }),
      500,
    );
  });
};

const VideoPreview = ({ videoId }: { videoId: string }) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetails>();

  useEffect(() => {
    loadVideoDetails(videoId).then((vd) => setVideoDetails(vd));
  }, [videoId]);

  return videoDetails ? (
    <div style={{ display: "flex" }}>
      <img
        style={{ width: "200px", borderRadius: "10px", border: "1px solid" }}
        src={videoDetails.previewUrl}
        alt="video preview"
      />

      <div style={{ paddingLeft: "10px" }}>
        <div style={{ fontWeight: "bold" }}>{videoDetails.title}</div>
        <div style={{ color: "#808080" }}>{videoDetails.author}</div>
      </div>
    </div>
  ) : (
    <span>loading...</span>
  );
};

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <VideoPreview videoId="testVideo" />
    </div>
  );
}

export default App;

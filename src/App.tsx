import { useState, useEffect } from "react";

type VideoDetails = {
  previewUrl: string;
  title: string;
  author: string;
};

type StreamDetails = VideoDetails & {
  watching: number;
};

const loadVideoDetails = (
  id: string,
): Promise<VideoDetails | StreamDetails> => {
  return new Promise((resolve): void => {
    setTimeout(
      () =>
        id.includes("stream")
          ? resolve({
              previewUrl: "https://i.ytimg.com/vi/gYszgvLdxpI/hqdefault.jpg",
              title: "Do we really need SOLID in front-end?",
              author: "@NtonBala",
              watching: 1200,
            })
          : resolve({
              previewUrl: "https://i.ytimg.com/vi/BlNwQdqdRig/hqdefault.jpg",
              title: "Functional TypeScript: curry function",
              author: "@NtonBala",
            }),
      500,
    );
  });
};

const VideoPreview = ({ videoId }: { videoId: string }) => {
  const [videoDetails, setVideoDetails] = useState<
    VideoDetails | StreamDetails
  >();

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

        {"watching" in videoDetails && (
          <>
            <div style={{ color: "#808080" }}>{videoDetails.watching}</div>
            <span
              style={{ color: "white", backgroundColor: "red", padding: "3px" }}
            >
              live
            </span>
          </>
        )}
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
      <br />
      <VideoPreview videoId="teststream" />
    </div>
  );
}

export default App;

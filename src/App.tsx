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
          author: "@NtonBala",
        }),
      500,
    );
  });
};

const useVideoDetails = (videoId: string) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetails>();

  useEffect(() => {
    loadVideoDetails(videoId).then((vd) => setVideoDetails(vd));
  }, [videoId]);

  return videoDetails;
};

const VideoPreviewImage = ({
  videoDetails,
}: {
  videoDetails: VideoDetails;
}) => (
  <img
    style={{ width: "200px", borderRadius: "10px", border: "1px solid" }}
    src={videoDetails.previewUrl}
    alt="video preview"
  />
);

const VideoDescription = ({ videoDetails }: { videoDetails: VideoDetails }) => (
  <>
    <div style={{ fontWeight: "bold" }}>{videoDetails.title}</div>
    <div style={{ color: "#808080" }}>{videoDetails.author}</div>
  </>
);

const Loader = () => <span>loading...</span>;

// Pass things VideoPreview component uses and implementation details as parameters
// Things component uses:
// 1. videoDetails data
// Implementation details:
// 1. useVideoDetails hook
// 2. component to be returned (actual content)

const VideoPreview = ({ videoId }: { videoId: string }) => {
  const videoDetails = useVideoDetails(videoId);

  return videoDetails ? (
    <div style={{ display: "flex" }}>
      <VideoPreviewImage videoDetails={videoDetails} />

      <div style={{ paddingLeft: "10px" }}>
        <VideoDescription videoDetails={videoDetails} />
      </div>
    </div>
  ) : (
    <Loader />
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

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
const renderVideoPreviewImage = (videoDetails: VideoDetails) => (
  <VideoPreviewImage videoDetails={videoDetails} />
);

const VideoDescription = ({ videoDetails }: { videoDetails: VideoDetails }) => (
  <>
    <div style={{ fontWeight: "bold" }}>{videoDetails.title}</div>
    <div style={{ color: "#808080" }}>{videoDetails.author}</div>
  </>
);
const renderVideoDescription = (videoDetails: VideoDetails) => (
  <VideoDescription videoDetails={videoDetails} />
);

const Loader = () => <span>loading...</span>;
const renderLoader = () => <Loader />;

type VideoPreviewProps = {
  videoId: string;
  videoDetailsGetter?: typeof useVideoDetails;
  renderImagePreview?: (videoDetails: VideoDetails) => React.ReactElement;
  renderDescription?: (VideoDetails: VideoDetails) => React.ReactElement;
  renderLoader?: () => React.ReactElement;
};

const VideoPreview = ({
  videoId,
  videoDetailsGetter = useVideoDetails,
  renderImagePreview = renderVideoPreviewImage,
  renderDescription = renderVideoDescription,
  renderLoader: renderLoaderProp = renderLoader,
}: VideoPreviewProps) => {
  const videoDetails = videoDetailsGetter(videoId);

  return videoDetails ? (
    <div style={{ display: "flex" }}>
      {renderImagePreview(videoDetails)}

      <div style={{ paddingLeft: "10px" }}>
        {renderDescription(videoDetails)}
      </div>
    </div>
  ) : (
    renderLoaderProp()
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

import { useState, useEffect } from "react";

type VideoDetails = {
  previewUrl: string;
  title: string;
  author: string;
};

type StreamDetails = VideoDetails & { watching: number };

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

const loadStreamDetails = (id: string): Promise<StreamDetails> => {
  return new Promise((resolve): void => {
    setTimeout(
      () =>
        resolve({
          previewUrl: "https://i.ytimg.com/vi/gYszgvLdxpI/hqdefault.jpg",
          title: "Do we really need SOLID?",
          author: "@NtonBala",
          watching: 12000,
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

const useStreamDetails = (videoId: string) => {
  const [videoDetails, setVideoDetails] = useState<StreamDetails>();

  useEffect(() => {
    loadStreamDetails(videoId).then((vd) => setVideoDetails(vd));
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

type VideoPreviewProps = {
  videoId: string;
  videoDetailsGetter?: typeof useVideoDetails;
  ImagePreviewComponent?: React.FunctionComponent<{
    videoDetails: VideoDetails;
  }>;
  DescriptionComponent?: React.FunctionComponent<{
    videoDetails: VideoDetails;
  }>;
  LoaderComponent?: React.FunctionComponent<{}>;
};

const VideoPreview = ({
  videoId,
  videoDetailsGetter = useVideoDetails,
  ImagePreviewComponent = VideoPreviewImage,
  DescriptionComponent = VideoDescription,
  LoaderComponent = Loader,
}: VideoPreviewProps) => {
  const videoDetails = videoDetailsGetter(videoId);

  return videoDetails ? (
    <div style={{ display: "flex" }}>
      <ImagePreviewComponent videoDetails={videoDetails} />

      <div style={{ paddingLeft: "10px" }}>
        <DescriptionComponent videoDetails={videoDetails} />
      </div>
    </div>
  ) : (
    <LoaderComponent />
  );
};

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <VideoPreview videoId="testVideo" />
      <br />
      <VideoPreview
        videoId="testStream"
        videoDetailsGetter={useStreamDetails}
      />
    </div>
  );
}

export default App;

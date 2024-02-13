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

type VideoPreviewImageProps = Pick<VideoDetails, "previewUrl">;

const VideoPreviewImage = ({ previewUrl }: VideoPreviewImageProps) => (
  <img
    style={{ width: "200px", borderRadius: "10px", border: "1px solid" }}
    src={previewUrl}
    alt="video preview"
  />
);

const VideoDescription = ({ videoDetails }: { videoDetails: VideoDetails }) => (
  <>
    <div style={{ fontWeight: "bold" }}>{videoDetails.title}</div>
    <div style={{ color: "#808080" }}>{videoDetails.author}</div>
  </>
);

const StreamDescription = ({
  videoDetails,
}: {
  videoDetails: StreamDetails;
}) => (
  <>
    <VideoDescription videoDetails={videoDetails} />
    <div style={{ color: "#808080" }}>{videoDetails.watching} watching</div>
    <span style={{ color: "white", backgroundColor: "red", padding: "3px" }}>
      live
    </span>
  </>
);

const Loader = () => <span>loading...</span>;

type VideoPreviewProps<T extends VideoDetails> = {
  videoId: string;
  ImagePreviewComponent?: React.FunctionComponent<
    Pick<VideoDetails, "previewUrl">
  >;
  DescriptionComponent?: React.FunctionComponent<{
    videoDetails: T;
  }>;
  LoaderComponent?: React.FunctionComponent<{}>;
};

const getVideoPreview =
  <T extends VideoDetails>(videoDetailsGetter: (id: string) => T | undefined) =>
  ({
    videoId,
    ImagePreviewComponent = VideoPreviewImage,
    DescriptionComponent = VideoDescription,
    LoaderComponent = Loader,
  }: VideoPreviewProps<T>) => {
    const videoDetails = videoDetailsGetter(videoId);

    return videoDetails ? (
      <div style={{ display: "flex" }}>
        <ImagePreviewComponent previewUrl={videoDetails.previewUrl} />

        <div style={{ paddingLeft: "10px" }}>
          <DescriptionComponent videoDetails={videoDetails} />
        </div>
      </div>
    ) : (
      <LoaderComponent />
    );
  };

const VideoPreview = getVideoPreview(useVideoDetails);
const StreamPreview = getVideoPreview(useStreamDetails);

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <VideoPreview videoId="testVideo" />
      <br />
      <StreamPreview
        videoId="testStream"
        DescriptionComponent={StreamDescription}
      />
    </div>
  );
}

export default App;

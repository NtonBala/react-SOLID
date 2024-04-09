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

type VideoDescriptionProps = Pick<VideoDetails, "title" | "author">;
const VideoDescription = ({ title, author }: VideoDescriptionProps) => (
  <>
    <div style={{ fontWeight: "bold" }}>{title}</div>
    <div style={{ color: "#808080" }}>{author}</div>
  </>
);

type StreamDescriptionProps = VideoDetails & Pick<StreamDetails, "watching">;
const StreamDescription = ({ watching, ...rest }: StreamDescriptionProps) => (
  <>
    <VideoDescription {...rest} />
    <div style={{ color: "#808080" }}>{watching} watching</div>
    <span style={{ color: "white", backgroundColor: "red", padding: "3px" }}>
      live
    </span>
  </>
);

const Loader = () => <span>loading...</span>;

type VideoPreviewTemplateProps<T extends VideoDetails> = {
  videoDetails: T;
  renderImagePreview?: (video: T) => React.ReactElement;
  renderDescription?: (video: T) => React.ReactElement;
};

const VideoPreviewTemplate = <T extends VideoDetails>({
  videoDetails,
  renderImagePreview = (video) => (
    <VideoPreviewImage previewUrl={video.previewUrl} />
  ),
  renderDescription = (video) => <VideoDescription {...video} />,
}: VideoPreviewTemplateProps<T>) => {
  return (
    <div style={{ display: "flex" }}>
      {renderImagePreview(videoDetails)}

      <div style={{ paddingLeft: "10px" }}>
        {renderDescription(videoDetails)}
      </div>
    </div>
  );
};

type SelfLoadingVideoPreviewProps<T extends VideoDetails> = {
  videoId: string;
  useVideoDetails: (id: string) => T | undefined;
  renderVideoPreview?: (video: T) => React.ReactElement;
  LoaderComponent?: React.FunctionComponent<{}>;
};

const SelfLoadingVideoPreview = <T extends VideoDetails>({
  videoId,
  useVideoDetails,
  renderVideoPreview = (video) => <VideoPreviewTemplate videoDetails={video} />,
  LoaderComponent = Loader,
}: SelfLoadingVideoPreviewProps<T>) => {
  const videoDetails = useVideoDetails(videoId);

  return videoDetails ? renderVideoPreview(videoDetails) : <LoaderComponent />;
};

const loadData = () =>
  Promise.all([loadVideoDetails("video"), loadStreamDetails("stream")]);

function App() {
  const [videos, setVideos] = useState<VideoDetails[]>([]);

  useEffect(() => {
    loadData().then((data) => setVideos(data));
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {videos.map((video) => {
        if ("watching" in video) {
          return (
            <VideoPreviewTemplate
              key={video.previewUrl}
              videoDetails={video as StreamDetails}
              renderDescription={(video) => <StreamDescription {...video} />}
            />
          );
        }

        return (
          <VideoPreviewTemplate key={video.previewUrl} videoDetails={video} />
        );
      })}

      <hr style={{ width: "100%" }} />

      <SelfLoadingVideoPreview
        videoId="testVideo"
        useVideoDetails={useVideoDetails}
      />
      <br />
      <SelfLoadingVideoPreview
        videoId="testStream"
        useVideoDetails={useStreamDetails}
        renderVideoPreview={(video) => (
          <VideoPreviewTemplate
            videoDetails={video}
            renderDescription={(video) => <StreamDescription {...video} />}
          />
        )}
      />
    </div>
  );
}

export default App;

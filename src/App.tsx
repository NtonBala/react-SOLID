import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

type VideoPreviewContextState = {
  videoDetails: null | VideoDetails;
};

const getDefaultVideoPreviewContextState = () => ({
  videoDetails: null,
});

type VideoPreviewContextStore = {
  state: VideoPreviewContextState;
  setVideoDetails: (videoDetails: VideoDetails) => void;
};

const useVideoPreviewContextStore = (): VideoPreviewContextStore => {
  const [state, setState] = useState<VideoPreviewContextState>(
    getDefaultVideoPreviewContextState(),
  );

  const setVideoDetails = useCallback((videoDetails: VideoDetails): void => {
    setState((prevState) => ({ ...prevState, videoDetails }));
  }, []);

  return {
    state,
    setVideoDetails,
  };
};

const VideoPreviewContext = createContext<VideoPreviewContextStore | undefined>(
  undefined,
);

function useDefinedContext<T>(contextProp: React.Context<T | undefined>) {
  const context = useContext(contextProp);

  if (!context) {
    throw new Error(
      "Cannot use the context without providing it by ContextProvider",
    );
  }

  return context;
}

const useVideoPreviewContext = () =>
  useDefinedContext<VideoPreviewContextStore>(VideoPreviewContext);

const VideoPreviewContextProvider = ({ children }: React.PropsWithChildren) => {
  const store = useVideoPreviewContextStore();

  return (
    <VideoPreviewContext.Provider value={store}>
      {children}
    </VideoPreviewContext.Provider>
  );
};

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

const useVideoDetailsEffect = (
  videoId: string,
  loadVideoDetailsProp: typeof loadVideoDetails,
) => {
  const { setVideoDetails } = useVideoPreviewContext();

  useEffect(() => {
    loadVideoDetailsProp(videoId).then((vd) => setVideoDetails(vd));
  }, [videoId, setVideoDetails, loadVideoDetailsProp]);
};

const VideoPreviewImage = () => {
  const {
    state: { videoDetails },
  } = useVideoPreviewContext();

  if (!videoDetails) return null;

  return (
    <img
      style={{ width: "200px", borderRadius: "10px", border: "1px solid" }}
      src={videoDetails.previewUrl}
      alt="video preview"
    />
  );
};

const VideoDescription = () => {
  const {
    state: { videoDetails },
  } = useVideoPreviewContext();

  if (!videoDetails) return null;

  return (
    <>
      <div style={{ fontWeight: "bold" }}>{videoDetails.title}</div>
      <div style={{ color: "#808080" }}>{videoDetails.author}</div>
    </>
  );
};

const Loader = () => <span>loading...</span>;

type VideoPreviewProps = {
  videoId: string;
  videoDetailsGetter?: typeof loadVideoDetails;
  imagePreviewElement?: React.ReactElement;
  descriptionElement?: React.ReactElement;
  loaderElement?: React.ReactElement;
};

const VideoPreviewContent = ({
  videoId,
  videoDetailsGetter = loadVideoDetails,
  imagePreviewElement = <VideoPreviewImage />,
  descriptionElement = <VideoDescription />,
  loaderElement = <Loader />,
}: VideoPreviewProps) => {
  const {
    state: { videoDetails },
  } = useVideoPreviewContext();

  useVideoDetailsEffect(videoId, videoDetailsGetter);

  return videoDetails ? (
    <div style={{ display: "flex" }}>
      {imagePreviewElement}

      <div style={{ paddingLeft: "10px" }}>{descriptionElement}</div>
    </div>
  ) : (
    loaderElement
  );
};

const VideoPreview = ({
  children,
  ...props
}: React.PropsWithChildren<VideoPreviewProps>) => {
  return (
    <VideoPreviewContextProvider>
      <VideoPreviewContent {...props} />
    </VideoPreviewContextProvider>
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

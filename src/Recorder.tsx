import React, { useRef, useState } from 'react';

interface AsyncButtonProps {
  onClickAsync?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
}

const AsyncButton: React.FC<React.PropsWithChildren<AsyncButtonProps>> = ({
  onClickAsync,
  children,
}) => {
  const [loadingState, setLoadingState] = useState(false);
  const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClickAsync) {
      setLoadingState(true);
      onClickAsync(event).then(() => setLoadingState(false));
    }
  };
  return <button type="button" disabled={loadingState} onClick={onClick}>{children}</button>;
};

class RecWrapper extends MediaRecorder {
  private chunks: Blob[] = [];

  constructor(stream: MediaStream, options?: MediaRecorderOptions) {
    super(stream, options);
    super.addEventListener('dataavailable', ev => {
      this.chunks.push(ev.data);
    });
  }

  public getVideo(): string | undefined {
    if (this.chunks.length) {
      const blob = new Blob(this.chunks, {
        type: this.chunks[0].type,
      });
      return URL.createObjectURL(blob);
    }
  }

  public async startAsync(): Promise<void> {
    this.chunks = [];
    return new Promise((res, rej) => {
      super.addEventListener('start', () => res(), { once: true });
      super.addEventListener('error', e => rej(e), { once: true });
      super.start();
    });
  }

  public async stopAsync(): Promise<void> {
    return new Promise(res => {
      if (super.stream.active) {
        super.addEventListener('stop', () => res(), { once: true });
        super.stop();
      } else {
        res();
      }
    });
  }
}

const Rec = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>();
  const recorderRef = useRef<RecWrapper>();

  const startRecord = async (secondTry?: boolean) => {
    if (!recorderRef.current) {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({
          // not typed yet
          // https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
          video: {
            displaySurface: 'browser',
          },
          audio: false,
          preferCurrentTab: true,
        } as any);
      } catch (e) {
        alert((e as DOMException)?.message ?? e);
        return;
      }
      recorderRef.current = new RecWrapper(stream);
    }
    try {
      await recorderRef.current.startAsync();
    } catch (e) {
      if (!secondTry) {
        // second try if previous granted permission expired
        // ask permission again
        recorderRef.current = undefined;
        await startRecord(true);
      }
    }
    if (recorderRef.current?.state === 'recording') {
      setRecording(true);
    }
  };

  const stopRecord = async () => {
    await recorderRef.current?.stopAsync();
    setVideoUrl(recorderRef.current?.getVideo());
    setRecording(false);
  };

  return (
    <>
      {recording
        ? <AsyncButton onClickAsync={stopRecord}>Stop Recoding</AsyncButton>
        : <AsyncButton onClickAsync={() => startRecord()}>Record</AsyncButton>}
      {videoUrl ? <a href={videoUrl} download>Download Video</a> : null}
    </>
  );
};

export default Rec;

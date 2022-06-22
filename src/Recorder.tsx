import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

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
  return <button disabled={loadingState} onClick={onClick}>{children}</button>;
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
    return new Promise(res => {
      const handler = () => {
        res();
        super.removeEventListener('start', handler);
      };
      super.addEventListener('start', handler);
      super.start();
    });
  }

  public async stopAsync(): Promise<void> {
    return new Promise(res => {
      const handler = () => {
        res();
        super.removeEventListener('stop', handler);
      };
      super.addEventListener('stop', handler);
      super.stop();
    });
  }
}

const Rec = () => {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>();
  const recorderRef = useRef<RecWrapper>();

  const startRecord = async () => {
    if (!recorderRef.current) {
      recorderRef.current = new RecWrapper(await navigator.mediaDevices.getDisplayMedia());
    }
    await recorderRef.current.startAsync();
    console.log('started');
    setRecording(true);
  };

  const stopRecord = async () => {
    await recorderRef.current?.stopAsync();
    setVideoUrl(recorderRef.current?.getVideo());
    console.log('stoped');
    setRecording(false);
  };

  return (
    <>
      {recording
        ? <AsyncButton onClickAsync={stopRecord}>Stop</AsyncButton>
        : <AsyncButton onClickAsync={startRecord}>Record</AsyncButton>}
      {videoUrl ? <a href={videoUrl} download>Download Video</a> : null}
    </>
  );
};

export default Rec;

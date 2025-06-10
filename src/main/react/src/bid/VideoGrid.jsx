import React, { useEffect, useRef } from 'react';

const VideoGrid = ({ peers }) => {
  console.log('전체 peers:', peers);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {Object.entries(peers).map(([id, stream]) => {
        console.log("#####################",id,stream)
        // 비디오 트랙이 없으면 렌더링 안함
        const videoTracks = stream?.getVideoTracks() || [];
        if (videoTracks.length === 0) return null;
        return <Video key={id} stream={stream} muted={true} />;
      })}
    </div>
  );
};


const Video = ({ stream, muted }) => {
  console.log(stream.getVideoTracks());
  console.log(muted);
  console.log("--------------");
  const videoRef = useRef();

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.onloadedmetadata = () => console.log('✅ metadata loaded');
    videoEl.onplaying = () => console.log('▶️ playing');
    videoEl.onwaiting = () => console.log('⏳ waiting');
    videoEl.onerror = (e) => console.error('❌ error', e);
    if (stream) {
      videoEl.srcObject = stream;
      videoEl
        .play()
        .catch(e => console.warn('video play error:', e));
    } else {
      videoEl.srcObject = null;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      width={320}
      height={240}
      style={{ backgroundColor: 'black' }}
      onError={e => console.error('Video element error:', e)}
    />
  );
};

export default VideoGrid;

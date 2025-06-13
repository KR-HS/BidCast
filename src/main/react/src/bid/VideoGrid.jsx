import React, {useEffect, useRef, useState} from 'react';

const VideoGrid = ({peers, hostId, myId}) => {
    const [mainStreamId, setMainStreamId] = useState(null);  // 메인화면에 보여줄 스트림 Id
    const [scrollX, setScrollX] = useState(0); // 서브 비디오 영역의 스크롤 위치
    const [maxScrollX, setMaxScrollX] = useState(0); // 스크롤 가능한 최대 길이
    const subVideosRef = useRef(); // 서브 비디오들을 감싸는 div 참조


    // 메인스트림 자동 설정
    useEffect(() => {
        if (!hostId) return;

        const hostStream = peers[hostId];
        const hostHasVideo = hostStream && hostStream.getVideoTracks().length > 0;

        // 메인 스트림이 없고 호스트가 영상을 보낸다면 메인화면으로 설정
        if (!mainStreamId && hostHasVideo) {
            setMainStreamId(hostId);
        }

        // 호스트 영상이 중단되었으면 메인화면 제거
        if (!hostHasVideo && mainStreamId === hostId) {
            setMainStreamId(null);
            return;
        }

        // 항상 메인화면을 호스트로 고정
        // setMainStreamId(hostId);

    }, [peers, hostId]);


    // 서브 화면 클릭시 메인화면과 교체
    const handleSwap = (id) => {
        setMainStreamId(id);
    };

    // mainstream(영상) 설정
    const mainStream = peers ? peers[mainStreamId] : null;
    const subPeers = Object.entries(peers).filter(
        ([id, stream]) =>
            id !== mainStreamId &&
            stream != null &&
            stream.getVideoTracks().length > 0
    );


    useEffect(() => {
        // 스크롤 가능한 최대 길이 계산
        const updateMaxScroll = () => {
            const container = subVideosRef.current?.parentElement;
            if (!container || !subVideosRef.current) return;

            const max = Math.max(0, subVideosRef.current.scrollWidth - container.clientWidth);
            setMaxScrollX(max);
        };

        updateMaxScroll();
        window.addEventListener('resize', updateMaxScroll);
        return () => window.removeEventListener('resize', updateMaxScroll);
    }, [subPeers]);

    const scrollAmount = 220;

    const scrollLeft = () => {
        setScrollX(prev => {
            const newX = Math.max(prev - scrollAmount, 0);
            return newX;
        });
    };

    const scrollRight = () => {
        setScrollX(prev => {
            const newX = Math.min(prev + scrollAmount, maxScrollX);
            return newX;
        });
    };

    useEffect(() => {
        if (subVideosRef.current) {
            subVideosRef.current.style.transform = `translateX(-${scrollX}px)`;
        }
    }, [scrollX]);

    return (
        <div className="videoWrapper">
            <div className="main-videoWrapper">
                <h1>메인화면 {mainStreamId}</h1>
                {mainStream ? (
                    <Video id={mainStreamId} stream={mainStream} muted={mainStreamId === myId}/>
                ) : (
                    <div className="main-video-stop">방송이 중단되었습니다.</div>
                )}
            </div>

            <h1>서브화면</h1>
            <div className="sub-videoWrapper">
                {subPeers.length > 0 ? (
                    <>
                        <div className="sub-videos-arrow left">
                            {scrollX > 0 && (
                                <img src="/img/arrow_left.png" alt="arrow-left" onClick={scrollLeft}/>
                            )}
                        </div>

                        <div className="sub-videos-container">
                            <div className="sub-videos" ref={subVideosRef}>
                                {subPeers.map(([id, stream]) => (
                                    <div key={id} className="sub-video" onClick={() => handleSwap(id)}>
                                        <Video id={id} stream={stream} muted={id === myId}/>
                                        <p className="guestId">{id}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sub-videos-arrow right">
                            {scrollX < maxScrollX && (
                                <img src="/img/arrow_right.png" alt="arrow-right" onClick={scrollRight}/>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-participants">참가 중인 인원이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

const Video = ({id, stream, muted}) => {
    const videoRef = useRef();

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        if (stream) {
            videoEl.srcObject = stream;
            videoEl.play().catch(e => console.warn('video play error:', e));
        } else {
            videoEl.srcObject = null;
        }
    }, [stream]);

    return (
        <video
            className="video"
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
        />
    );
};

export default VideoGrid;
import React, {useEffect, useRef, useState} from 'react';

const VideoGrid = ({peers, hostSocketId, mySocketId,children}) => {
    const [mainStreamId, setMainStreamId] = useState(null);  // 메인화면에 보여줄 스트림 Id
    const [scrollX, setScrollX] = useState(0); // 서브 비디오 영역의 스크롤 위치
    const [maxScrollX, setMaxScrollX] = useState(0); // 스크롤 가능한 최대 길이
    const subVideosRef = useRef(); // 서브 비디오들을 감싸는 div 참조


    // 메인스트림(호스트 소켓)  설정
    useEffect(() => {
        if (!hostSocketId) return;

        const hostPeer = peers[hostSocketId]
        const hostStream = hostPeer?.stream
        const hostHasVideo = hostStream && hostStream.getVideoTracks().length > 0;

        // 메인 스트림이 없고 호스트가 영상을 보낸다면 메인화면으로 설정
        if (hostHasVideo && mainStreamId !== hostSocketId) {
            setMainStreamId(hostSocketId);
        }

        // 호스트 영상이 중단되었으면 메인화면 제거
        if (!hostHasVideo && mainStreamId === hostSocketId) {
            setMainStreamId(null);
        }

        // 항상 메인화면을 호스트로 고정
        // setMainStreamId(hostVideoId);

    }, [peers, hostSocketId, mainStreamId]);


    // 서브 화면 클릭시 메인화면과 교체
    const handleSwap = (id) => {
        setMainStreamId(id);
    };

    // mainstream(영상) 설정
    const mainStream = peers && peers[mainStreamId] ? peers[mainStreamId].stream : null;
    const subPeers = Object.entries(peers).filter(
        ([id, peer]) =>
            id !== mainStreamId &&
            peer?.stream &&
            peer.stream.getVideoTracks().length > 0
    );


    // 서브비디오 목록 이동
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


    // ----
    return (
        <div className="videoWrapper">
            <div className="main-videoWrapper">
                {/*<p className="main-video-title">메인화면 {mainStreamId}</p>*/}
                {mainStream ? (
                    <Video id={mainStreamId}
                           stream={mainStream}
                           initialMuted={mainStreamId === mySocketId}
                           showMuteButton={false}/>
                ) : (
                    <div className="videoBox" style={{border:'2px solid transparent'}}>
                        <div className="main-video-stop">방송이 중단되었습니다.</div>
                    </div>
                )}
            </div>

            <div className="streaming-btn-wrap">
                <p className="guideWording">게스트 화면</p>
                {children}
            </div>
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
                                {subPeers.map(([id, peer]) => (
                                    <div key={id} className="sub-video" onClick={() => handleSwap(id)}>
                                        <p className="guestId">{id}</p>
                                        <Video id={id}
                                               stream={peer.stream}
                                               initialMuted={true}
                                               showMuteButton={true}
                                        />
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
                    <div className="no-participants">화면공유 인원이 없습니다.</div>
                )}
            </div>
        </div>
    );
};

const Video = ({id, stream, initialMuted, showMuteButton}) => {
    const videoRef = useRef();
    const [muted, setMuted] = useState(initialMuted);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        if (muted) {
            setIsSpeaking(false);
        }
    }, [muted]);

    // 음성 볼륨 체크용 ref
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const dataArrayRef = useRef(null);
    const rafIdRef = useRef(null);


    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        if (stream) {
            videoEl.srcObject = stream;
            videoEl.play().catch(e => console.warn('video play error:', e));

            // 오디오 분석 초기화 (마이크나 오디오가 없는 경우 대비)
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window['webkitAudioContext'])();
            }

            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }

            if (stream.getAudioTracks().length > 0) {
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                sourceRef.current.connect(analyserRef.current);

                const bufferLength = analyserRef.current.frequencyBinCount;
                dataArrayRef.current = new Uint8Array(bufferLength);

                const checkVolume = () => {
                    if (muted || !analyserRef.current || !dataArrayRef.current) {
                        setIsSpeaking(false);
                        rafIdRef.current = requestAnimationFrame(checkVolume);
                        return;
                    }

                    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                    const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / bufferLength;
                    setIsSpeaking(avg > 15);
                    rafIdRef.current = requestAnimationFrame(checkVolume);
                };

                checkVolume();
            }

        } else {
            videoEl.srcObject = null;
            setIsSpeaking(false);
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        }

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
                sourceRef.current = null;
            }
            if (analyserRef.current) {
                analyserRef.current.disconnect();
                analyserRef.current = null;
            }
        };

    }, [stream, muted]);

    // 음소거 토글 함수
    const toggleMute = (e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 방지
        setMuted(prev => !prev);
    };

    return (
        <div className="videoBox" style={{border: isSpeaking ? '4px solid limegreen' : '2px solid transparent'}}>
            <video
                className="video"
                ref={videoRef}
                autoPlay
                playsInline
                muted={muted}
            />
            {showMuteButton && (
                <button className="muteButton"
                        style={{backgroundColor: muted ? 'rgba(255,0,0,0.7)' : 'rgba(0,0,0,0.5)'}}
                        onClick={toggleMute}
                        title={muted ? '음소거해제' : '음소거'}>
                    {muted ? '🔇' : '🔊'}
                </button>
            )}
        </div>
    );
};

export default VideoGrid;
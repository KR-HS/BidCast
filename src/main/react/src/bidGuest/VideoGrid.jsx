import React, {useEffect, useMemo, useRef, useState} from 'react';
import {MdSwapHoriz} from "react-icons/md";

const VideoGrid = ({peers, hostSocketId, mySocketId, isAuctionEnded, userInfoMap, product, children}) => {
    const [mainStreamId, setMainStreamId] = useState(null);  // 메인화면에 보여줄 스트림 Id
    const [scrollX, setScrollX] = useState(0); // 서브 비디오 영역의 스크롤 위치
    const [maxScrollX, setMaxScrollX] = useState(0); // 스크롤 가능한 최대 길이
    const subVideosRef = useRef(); // 서브 비디오들을 감싸는 div 참조


    useEffect(() => {
        console.log('Current peers:', peers);
        console.log(peers[hostSocketId]);
        console.log(peers[hostSocketId]?.stream.getVideoTracks().length === 0)
    }, [peers]);

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
        if (!hostHasVideo && mainStreamId && peers[mainStreamId]?.stream && peers[mainStreamId]?.stream.getVideoTracks().length > 0) {
            setMainStreamId(null);
        }
        // 호스트 영상이 중단되었으면 메인화면 제거
        else if (!hostHasVideo && mainStreamId === hostSocketId) {
            setMainStreamId(null);
        }

        // 항상 메인화면을 호스트로 고정
        // setMainStreamId(hostVideoId);

    }, [peers, hostSocketId]);


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


    // const [highestBidderIds, setHighestBidderIds] = useState(new Set());

    const highestBidderIds = useMemo(() => {
        if (!product || !userInfoMap) return new Set();

        const set = new Set();
        for (const [id, user] of Object.entries(userInfoMap)) {
            const bidAmount = Number(user?.bids?.[String(product.prodKey)] ?? 0);
            if (bidAmount === Number(product.finalPrice) && product.finalPrice > 0) {
                set.add(id);
            }
        }
        return set;
    }, [product, userInfoMap]);


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

    useEffect(() => {
        console.log("리렌더링됨!!!!!!!!!!!!!!!!!!!!!1", product, userInfoMap)
    }, [product, userInfoMap])
    const [subMutedStates, setSubMutedStates] = useState({}); // key: id, value: muted

    const onSubMuteChange = (id, muted) => {
        setSubMutedStates(prev => ({...prev, [id]: muted}));
    };

    // ----
    return (
        <div className="videoWrapper">
            <div className="main-videoWrapper">
                {/*<p className="main-video-title">메인화면 {mainStreamId}</p>*/}
                {mainStream ? (
                    <Video id={mainStreamId}
                           stream={mainStream}
                           initialMuted={mainStreamId === mySocketId}
                           showMuteButton={false}
                           isMain={true}
                           isHighestBidder={false}
                    />
                ) : (
                    <div className="videoBox" style={{border: '2px solid transparent'}}>
                        <div className="main-video-stop">{isAuctionEnded ? "경매가 종료되었습니다." : "방송이 중단되었습니다."}</div>
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
                                {subPeers.map(([id, peer]) => {
                                    const bidAmount = product ? (userInfoMap[id]?.bids?.[String(product.prodKey)] ?? 0) : 0;

                                    const isHighestBidder = highestBidderIds.has(id);
                                    return (
                                        <div key={`${id}-${product?.prodKey ?? 'noProduct'}`} className="sub-video">
                                            <div className="guestInfo">
                                                <p className="guestId">[{userInfoMap[id]?.nickname ?? '알 수 없음'}]</p>
                                                <p className="guest-bidAmount">{bidAmount}원</p>
                                            </div>
                                            <Video
                                                key={id}
                                                id={id}
                                                stream={peer.stream}
                                                muted={subMutedStates[id] ?? true}
                                                onMuteChange={(muted) => onSubMuteChange(id, muted)}
                                                onSwap={handleSwap}
                                                isHighestBidder={isHighestBidder}
                                            />
                                        </div>
                                    )
                                })}
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


const Video = ({id, stream, muted: mutedProp, onMuteChange, isMain = false, onSwap, isHighestBidder}) => {
    const videoRef = useRef();
    const [muted, setMuted] = useState(mutedProp ?? true);
    const [volume, setVolume] = useState(1); // 기본 볼륨 100%
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hovered, setHovered] = useState(false);

    // mutedProp이 바뀌면 내부 상태도 동기화
    useEffect(() => {
        if (mutedProp !== undefined && mutedProp !== muted) {
            setMuted(mutedProp);
        }
    }, [mutedProp]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = muted;
            videoRef.current.volume = muted ? 0 : volume;
        }
    }, [volume, muted]);


    // 볼륨 조절 핸들러
    const handleVolumeChange = (e) => {
        e.stopPropagation();  // 부모로 이벤트 전파 차단!
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);

        // 볼륨이 0보다 크고 현재 음소거 상태라면 자동으로 해제
        if (muted && newVolume > 0) {
            setMuted(false);
            onMuteChange && onMuteChange(false);
        }

        // 비디오 요소의 볼륨 업데이트
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };


    // 전체화면 핸들러
    const handleFullscreen = () => {
        const videoEl = videoRef.current;
        if (videoEl) {
            if (videoEl.requestFullscreen) {
                videoEl.requestFullscreen();
            } else if (videoEl.webkitRequestFullscreen) {
                videoEl.webkitRequestFullscreen();
            } else if (videoEl.msRequestFullscreen) {
                videoEl.msRequestFullscreen();
            }
        }
    };


    // 음성 볼륨 체크용 ref
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const dataArrayRef = useRef(null);
    const rafIdRef = useRef(null);
    const mutedRef = useRef(muted);
    const isSpeakingRef = useRef(false);

    useEffect(() => {
        mutedRef.current = muted;
        if (muted) {
            setIsSpeaking(false);
        }
    }, [muted]);

    useEffect(() => {
        console.log(`Video ${id} stream changed`, stream, videoRef.current);
        const videoEl = videoRef.current;
        if (!videoEl) return;
        if (stream) {
            if (videoEl.srcObject !== stream) {
                videoEl.srcObject = stream;

                videoEl.play().catch(e => {
                    if (e.name !== 'AbortError') {
                        console.warn('video play error:', e);
                    }
                });
            }
            videoEl.volume = volume;

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
                    if (mutedRef.current || !analyserRef.current || !dataArrayRef.current) {
                        if (isSpeakingRef.current) {
                            isSpeakingRef.current = false
                            setIsSpeaking(false)
                        }
                        rafIdRef.current = requestAnimationFrame(checkVolume);
                        return;
                    }

                    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                    const avg = dataArrayRef.current.reduce((a, b) => a + b, 0) / bufferLength;

                    if (avg > 40) {
                        if (!isSpeakingRef.current) {
                            isSpeakingRef.current = true;
                            setIsSpeaking(true);
                        }
                    } else {
                        if (isSpeakingRef.current) {
                            isSpeakingRef.current = false;
                            setIsSpeaking(false);
                        }
                    }
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
            if (videoEl) {
                videoEl.srcObject = null;
            }
        };

    }, [stream]);


    // 음소거 토글 함수
    const toggleMute = (e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 방지
        const newMuted = !muted;
        setMuted(newMuted);
        onMuteChange && onMuteChange(newMuted);
    };

    const onMouseEnter = () => setHovered(true);
    const onMouseLeave = () => setHovered(false);

    const handleSwapClick = (e) => {
        e.stopPropagation();
        if (onSwap) {
            onSwap(id);
        }
    };

    useEffect(() => {
        console.log('isSpeaking:', isSpeaking);
    }, [isSpeaking]);

    useEffect(() => {
        document.querySelectorAll('.volume-slider').forEach(slider => {
            updateVolumeSliderBackground(slider);

            slider.addEventListener('input', () => {
                updateVolumeSliderBackground(slider);
                slider.parentElement.parentElement.querySelector('video').muted = false;
            });
        });
    }, [])

    function updateVolumeSliderBackground(slider) {
        const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, #00ffcc 0%, #00ffcc ${value}%, #ccc ${value}%, #ccc 100%)`;
    }

    return (
        <div className={`videoBox${!isMain ? ' small' : ''}${isSpeaking ? ' speaking' : ''}`}
             style={{
                 border: isSpeaking && !isMain
                     ? '4px solid limegreen'
                     : !isSpeaking && !isMain && isHighestBidder
                         ? '4px solid #EA6946'    // 최고 입찰자 + 말 안할 때 오렌지
                         : '4px solid transparent'  // 그 외는 투명
             }}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}
        >
            <video
                className="video"
                ref={videoRef}
                autoPlay
                playsInline
            />

            <div className="video-controls">
                <button className="icon-button" onClick={toggleMute} title={muted ? '음소거 해제' : '음소거'}>
                    {muted || volume === 0 ? '🔇' : '🔊'}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    style={{fill: 'red'}}
                    className="volume-slider"
                    title="볼륨 조절"
                />
                <button className="icon-button" onClick={handleFullscreen} title="전체화면">
                    ⛶
                </button>
            </div>
            {!isMain && hovered && (
                <button className="swap-btn" onClick={handleSwapClick} title="메인으로 전환">
                    <MdSwapHoriz size={12}/>
                </button>
            )}
        </div>
    );
};

export default VideoGrid;
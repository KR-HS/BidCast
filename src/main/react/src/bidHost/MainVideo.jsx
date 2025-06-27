import React, {useEffect, useRef, useState} from "react";

const MainVideo = ({peers, hostSocketId, children}) => {

    const [stream, setStream] = useState(null);

    useEffect(() => {
        if (peers) {
            setStream(peers.stream);
        } else {
            setStream(null)
        }
    }, [peers])

    const [MutedStates, setMutedStates] = useState(true); // key: id, value: muted


    return (
        <>
            <div className="main-videoWrapper">
                <div className="streaming-btn-wrap">
                    {children}
                </div>

                {stream ? (
                    <Video
                        key={hostSocketId}
                        id={hostSocketId}
                        stream={stream}
                        muted={true}
                        onMuteChange={(muted) => setMutedStates(muted)}
                    />
                ) : (
                    <div className="videoBox" style={{border: '2px solid transparent'}}>
                        <div className="main-video-stop">방송 대기중</div>
                    </div>
                )}
            </div>

        </>
    )
}

const Video = ({id, stream, muted: mutedProp, isMain = false}) => {
    const videoRef = useRef();
    const [muted, setMuted] = useState(mutedProp ?? true);
    const [volume, setVolume] = useState(1); // 기본 볼륨 100%
    const [isSpeaking, setIsSpeaking] = useState(false);

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
        // console.log(`Video ${id} stream changed`, stream, videoRef.current);
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

    }, [stream, muted]);


    // 음소거 토글 함수
    const toggleMute = (e) => {
        e.stopPropagation(); // 부모 클릭 이벤트 방지
        const newMuted = !muted;
        setMuted(newMuted);
        onMuteChange && onMuteChange(newMuted);
    };


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
            <div className="videoBox">
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

            </div>
    );
};


export default MainVideo;
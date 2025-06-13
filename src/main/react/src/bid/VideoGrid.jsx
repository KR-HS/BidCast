import React, {useEffect, useRef, useState} from 'react';

const VideoGrid = ({peers, hostId, myId}) => {
    const [mainStreamId, setMainStreamId] = useState(null);
    // useEffect(() => {
    //     // 아직 메인 스트림이 설정되지 않았다면
    //     console.log('useEffect called:', {mainStreamId, hostId, hasPeer: !!peers[hostId]});
    //     if (!mainStreamId && hostId && peers[hostId]) {
    //
    //         setMainStreamId(hostId); // hostId를 메인으로 설정
    //         console.log("메인스트림아이디 설정")
    //         console.log(mainStreamId);
    //     }
    // }, [peers, hostId, mainStreamId]);

    useEffect(() => {
        if (!hostId) return;

        console.log("여기!!!!")
        console.log(peers);
        console.log(hostId);
        const hostStream = peers[hostId];
        const hostHasVideo = hostStream && hostStream.getVideoTracks().length > 0;

        // 메인 스트림이 없고 호스트가 있다면 무조건 설정
        if (!mainStreamId && hostHasVideo) {
            setMainStreamId(hostId);
        }

        // 호스트 영상이 없으면 null 처리
        if (!hostHasVideo && mainStreamId === hostId) {
            setMainStreamId(null);
            console.log("메인스트림아이디 지움");
            return;
        }
        setMainStreamId(hostId);

    }, [peers, hostId]);


    useEffect(() => {
        const newPeers = {...peers}; // 얕은 복사
        let updated = false;

        for (const [id, stream] of Object.entries(peers)) {
            const tracks = stream?.getTracks() || [];
            const allStopped = tracks.every(track => track.readyState === 'ended');

            if (allStopped) {
                delete newPeers[id];
                updated = true;
            }
        }

        if (updated) {
            // setPeers가 부모에서 내려온 props라면 따로 제거 로직 필요
            // 또는 peers 상태 관리하는 곳에서 이런 스트림은 제거하도록 설계 필요
            console.log("⛔️ 중단된 스트림 제거됨");
        }
    }, [peers]);

// mainStreamId가 바뀔 때 로그 찍는 용도로 useEffect 추가 (필요하면)
    useEffect(() => {
        console.log('mainStreamId changed to:', mainStreamId);
        console.log(peers);
        console.log(peers[mainStreamId]);
    }, [mainStreamId]);

    const handleSwap = (id) => {
        setMainStreamId(id); // 서브 화면 클릭시 메인화면과 교체
    };

    const mainStream = peers ? peers[mainStreamId] : null;
    const subPeers = Object.entries(peers).filter(
        ([id, stream]) =>
            id !== mainStreamId &&
            stream != null &&
            stream.getVideoTracks().length > 0
    );

    return (
        <div className="videoWrapper">
            {/* 메인 화면 */}
            <div className="main-videoWrapper">
                <h1>메인화면 {hostId}</h1>
                {mainStream ? (
                    <Video id={mainStreamId} stream={mainStream} muted={mainStreamId === myId}/>
                ) : (
                    <div className="main-video-stop">
                        방송이 중단되었습니다.
                    </div>
                )}
            </div>

            <h1>서브화면</h1>
            {/* 서브 화면들 */}
            <div className="sub-videoWrapper">
                {
                    subPeers.some(([_, stream]) => (stream?.getVideoTracks()?.length ?? 0) > 0) ? (
                        <>
                            <div className="sub-videos-arrow">
                                <img src="/img/arrow_left.png" alt="arrow-left"/>
                            </div>

                            {/*<div className="sub-videos-container">*/}
                                <div className="sub-videos">
                                    {subPeers.map(([id, stream]) => {
                                        const videoTracks = stream?.getVideoTracks() || [];
                                        if (videoTracks.length === 0) return null;
                                        return (
                                            <div key={id} className="sub-video" onClick={() => handleSwap(id)}>
                                                <Video id={id} stream={stream} muted={id === myId}/>
                                                <p style={{
                                                    color: 'red',
                                                    textAlign: 'center',
                                                    fontSize: 8
                                                }}>{JSON.stringify(id)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            {/*</div>*/}

                            <div className="sub-videos-arrow">
                                <img src="/img/arrow_right.png" alt="arrow-right"/>
                            </div>
                        </>
                    ) : (
                        <div className="no-participants">참가 중인 인원이 없습니다.</div>
                    )
                }
            </div>
        </div>
    );
};

const Video = ({id, stream, muted}) => {
    const videoRef = useRef();

    console.log('Stream for', id, ':', stream);
    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        // videoEl.onloadedmetadata = () => console.log('✅ metadata loaded');
        // videoEl.onplaying = () => console.log('▶️ playing');
        // videoEl.onwaiting = () => console.log('⏳ waiting');
        // videoEl.onerror = (e) => console.error('❌ error', e);

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

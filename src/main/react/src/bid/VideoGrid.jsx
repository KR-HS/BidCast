import React, {useEffect, useRef, useState} from 'react';

const VideoGrid = ({peers, hostId, myId}) => {
    console.log("비디오그리드로 넘어옴")
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
        if (!mainStreamId) {
            if (hostId && peers[hostId]) {
                setMainStreamId(hostId);
            } else {
                const firstPeerId = Object.keys(peers).find(id => peers[id]?.getVideoTracks().length > 0);
                if (firstPeerId) setMainStreamId(firstPeerId);
            }
        }
    }, [peers, hostId]);

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
    const subPeers = peers ?
        Object.entries(peers).filter(([id, stream]) => id !== mainStreamId && stream != null && stream.getVideoTracks().length > 0) : [];

    return (
        <div>
            {/* 메인 화면 */}
            <div style={{marginBottom: 16}}>
                <h3 style={{color: 'green'}}>Main Screen ()</h3>
                {mainStream ? (
                    <Video id={mainStreamId} stream={mainStream} muted={mainStreamId === myId}/>
                ) : (
                    <div style={{
                        width: 640,
                        height: 480,
                        backgroundColor: '#111',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#fff'
                    }}>
                        방송이 중단되었습니다.
                    </div>
                )}
            </div>

            <h1>서브화면</h1>
            {/* 서브 화면들 */}
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                {subPeers.map(([id, stream]) => {
                    const videoTracks = stream?.getVideoTracks() || [];
                    if (videoTracks.length === 0) return null;
                    return (
                        <div key={id} onClick={() => handleSwap(id)} style={{cursor: 'pointer'}}>
                            <Video id={id} stream={stream} muted={id === myId}/>
                            <p style={{color: 'red', textAlign: 'center'}}>{JSON.stringify(id)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const Video = ({id,stream, muted}) => {
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
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
            width={640}
            height={480}
            style={{backgroundColor: 'black', border: '2px solid white'}}
        />
    );
};

export default VideoGrid;

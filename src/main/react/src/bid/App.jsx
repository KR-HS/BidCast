import './App.css'
import React, {useEffect, useState, useRef} from 'react'
import io from 'socket.io-client'
import {Device} from 'mediasoup-client'
import VideoGrid from './VideoGrid'
import Loader from "../Loader/Loader";


export default function App() {

    const [bidItems, setBidItems] = useState({}); // key:item , value:{currentBidAmount,finalUserId}

    const [msg, setMsg] = useState("");
    // 로딩 창
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 예: 1초 후에 로딩 끝난 걸로 처리
        const timer = setTimeout(() => {
            setIsLoading(false)

            const loader = document.getElementById('loader');
            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500); // CSS transition과 동일 시간
            }

        }, 1500);
        return () => clearTimeout(timer);
    }, []);


    // peers 상태: { self: MediaStream(내화면), producerId: MediaStream(상대화면) ... }
    const [peers, setPeers] = useState({}) // { socketId: { video: producerId, audio: producerId, stream: MediaStream } }
    // 스트리밍 상태(중단, 송출)
    const [isStreaming, setIsStreaming] = useState(false)
    // 호스트 식별자
    const [hostId, setHostId] = useState(null)
    const [mySocketId, setMySocketId] = useState(null)

    // mediasoup-client Device 인스턴스 (라우터 정보 로딩용)
    const device = useRef(null)
    // 송신용 WebRTC Transport (내 미디어 송출용)
    const sendTransport = useRef(null)
    // 수신용 WebRTC Transport (상대 미디어 수신용)
    const recvTransport = useRef(null)
    // consumers 객체: { producerId: consumer } 저장용 (중복 소비 방지 및 종료 관리)
    const consumers = useRef({})
    // 내 로컬 미디어 스트림 저장 (내 카메라+마이크)
    const localStream = useRef(null)
    // 내가 만든 producer id 집합 (내가 보낸 스트림 id 추적용)
    const myProducerIds = useRef(new Set())

    const videoProducer = useRef(null)
    const audioProducer = useRef(null)
    const socket = useRef(null)

    const params = new URLSearchParams(window.location.search);
    const [roomId, setRoomId] = useState(null);
    const [userId, setUserId] = useState(null);


    // const [producerIdToSocketId, setProducerIdToSocketId] = useState({});
    const [socketIdToProducerId, setSocketIdToProducerId] = useState({});
    const socketIdToProducerIdRef = useRef({});


    // 화면 첫 접속시 한번만 실행됨

    const roomIdRef = useRef(null);
    const userIdRef = useRef(null);

    useEffect(() => {
        roomIdRef.current = roomId;
        userIdRef.current = userId;
    }, [roomId, userId]);


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setRoomId(params.get("roomId"));
        setUserId(params.get("userId"));
        console.log("룸아이디, 유저아이디 설정됨", roomId, userId)
    }, []);


    useEffect(() => {
        if (!roomId || !userId) return;

        // 서버와 WebSocket 연결, websocket 전송 방식만 사용
        socket.current = io('https://bidcastserver.kro.kr', {transports: ['websocket']})

        socket.current.on('connect', () => {
            setMySocketId(socket.current.id)
        })


        // 로그인한 사용자 ID 등록 (로그인 되어 있다고 가정)
        socket.current.emit('register-login-id', {
            loginId: userId,
            auctionId: roomId
        })

        socket.current.emit('join-auction', {auctionId: roomId}, ({hostSocketId}) => {
            console.log("경매사이트 입장")
            setHostId(hostSocketId)
            console.log("호스트소켓아이디" + hostSocketId);
        })

        socket.current.on('host-available', ({auctionId, hostSocketId}) => {
            setHostId(hostSocketId);
            console.log(`Host is now available for auction ${auctionId}`, hostSocketId);
        });

        // 초기 시작 함수: mediasoup 라우터 연결 및 송수신 준비
        async function start() {
            try {
                // 1) 서버에 라우터 정보 요청, Device 객체 생성 후 라우터 RTP capabilities 로드
                socket.current.emit('create-router', null, async ({rtpCapabilities}) => {
                    device.current = new Device()
                    await device.current.load({routerRtpCapabilities: rtpCapabilities})

                    // 2) 내 로컬 미디어 스트림(비디오+오디오) 가져오기
                    localStream.current = await navigator.mediaDevices.getUserMedia({video: true, audio: true})


                    // 2. peers에 self추가
                    // peers 상태에 내 화면은 별도 'self' 키로 저장 (중복 방지 목적)
                    // setPeers({})

                    // 3) 송신용 Transport 생성 요청 및 생성
                    socket.current.emit('create-transport', {direction: 'send'}, (params) => {
                        sendTransport.current = device.current.createSendTransport(params)

                        // 송신용 Transport 연결 시 서버에 DTLS 파라미터 전송
                        sendTransport.current.on('connect', ({dtlsParameters}, callback, errback) => {
                            socket.current.emit('connect-transport', {
                                dtlsParameters,
                                transportId: sendTransport.current.id
                            }, (err) => {
                                if (err) errback()
                                else callback()
                            })
                        })

                        // 송신용 Transport가 produce 요청할 때 서버에 전송
                        sendTransport.current.on('produce', ({kind, rtpParameters}, callback) => {
                            socket.current.emit('produce', {
                                kind, // 영상인지, 오디오인지 종류
                                rtpParameters,
                                transportId: sendTransport.current.id,
                                roomId: roomId
                            }, ({id}) => {
                                // 받은 producerId를 내 producer 집합에 추가해서 추적
                                myProducerIds.current.add(id)
                                // console.log('Added producer id:', id);
                                // console.log('myProducerIds size:', myProducerIds.current.size);
                                // console.log('myProducerIds entries:', Array.from(myProducerIds.current));
                                setSocketIdToProducerId(prev => {
                                    const existing = prev[socket.current.id] || {}
                                    console.log("이미 가지고 있는 것들", existing)
                                    return {
                                        ...prev,
                                        [socket.current.id]: {
                                            ...existing,
                                            [kind]: id
                                        }
                                    };
                                });
                                console.log("프로듀서아이디들", socketIdToProducerId)
                                callback({id})
                            })
                        })
                    })

                    // 4) 수신용 Transport 생성 요청 및 생성
                    socket.current.emit('create-transport', {direction: 'recv'}, (params) => {
                        recvTransport.current = device.current.createRecvTransport(params)

                        // 수신용 Transport 연결 시 서버에 DTLS 파라미터 전송
                        recvTransport.current.on('connect', ({dtlsParameters}, callback, errback) => {
                            socket.current.emit('connect-transport', {
                                dtlsParameters,
                                transportId: recvTransport.current.id
                            }, (err) => {
                                if (err) errback()
                                else callback()
                            })
                        })

                        // 기존에 존재하는 producer 리스트 요청
                        socket.current.emit('get-existing-producers', {roomId: roomId},
                            ({existingProducers, hostSocketId}) => {
                                console.log("프로듀서 리스트 받아옴", existingProducers);
                                console.log("호스트아이디도 받아옴", hostSocketId);
                                // setHostId(hostSocketId);
                                existingProducers
                                    .filter(({producerId}) => !myProducerIds.current.has(producerId))
                                    .forEach(({socketId, producerId, kind}) => {
                                        setSocketIdToProducerId(prev => {
                                            const existing = prev[socketId] || {}
                                            return {
                                                ...prev,
                                                [socketId]: {
                                                    ...existing,
                                                    [kind]: producerId
                                                }
                                            }
                                        })
                                        console.log("consuming producer", producerId, "from", socketId);
                                        consume(producerId, socketId);
                                    });

                                console.log("소켓아이디랑 프로듀서아이디 매칭됨!!!!!!!!!!!!!", socketIdToProducerId);
                            });
                    })
                })

                // 새로운 producer
                socket.current.on('new-producer', ({producerId, socketId: remoteSocketId, kind}) => {
                    console.log('new-producer received:', producerId, remoteSocketId);
                    if (remoteSocketId === socket.current.id) return; // 내 producer면 무시

                    // setProducerIdToSocketId(prev => ({ ...prev, [producerId]: socketId }));
                    setSocketIdToProducerId(prev => {
                        const existing = prev[remoteSocketId] || {};
                        return {
                            ...prev,
                            [remoteSocketId]: {
                                ...existing,
                                [kind]: producerId
                            }
                        };
                    });
                    console.log('New producer from other:', producerId)
                    consume(producerId, remoteSocketId)

                })

                // 상대 유저가 연결을 끊었을 때 처리
                socket.current.on('user-disconnected', ({socketId, producerId}) => {
                    console.log('User disconnected:', socketId, producerId)

                    // 1. consumers 객체에서 해당 consumer 종료 및 삭제
                    if (consumers.current[producerId]) {
                        consumers.current[producerId].close()
                        delete consumers.current[producerId]
                    }

                    // 2. peers 상태에서 해당 producerId의 비디오 스트림 삭제
                    setPeers(prev => {
                        const updated = {...prev}
                        delete updated[socketId]
                        return updated
                    })

                    // 🔴 [추가] socketIdToProducerId 상태에서 삭제
                    setSocketIdToProducerId(prev => {
                        const updated = {...prev}
                        if (updated[socketId]) {
                            // 해당 socketId 내 video, audio producerId 중 하나가 producerId와 일치하면 제거
                            Object.entries(updated[socketId]).forEach(([kind, id]) => {
                                if (id === producerId) {
                                    delete updated[socketId][kind]
                                }
                            })
                            // 만약 빈 객체라면 socketId 키 자체 삭제
                            if (Object.keys(updated[socketId]).length === 0) {
                                delete updated[socketId]
                            }
                        }
                        return updated
                    })
                })


            } catch (err) {
                console.error('Start error:', err)
            }
        }

        ////////////////////////////////////////////
        //   다른 화면에 접속했을떄 기존 소켓 종료      //
        ////////////////////////////////////////////
        socket.current.on('force-disconnect', () => {
            alert('다른 기기에서 로그인되어 연결이 종료되었습니다.');
            // 소켓 연결은 서버가 이미 끊었기 때문에 여기선 안내만 해주면 됨

            // 로컬 미디어 스트림 중지
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
                localStream.current = null;
            }

            // 소켓 강제 종료
            socket.current.disconnect();

        });

        // 상대방 producer 스트림을 consume 하는 함수
        async function consume(producerId, socketId) {

            const myProducers = socketIdToProducerIdRef.current[socket.current.id] || {};

            // ✅ 자기 자신의 producerId는 무시
            if (producerId === myProducers.video || producerId === myProducers.audio) {
                console.log('👤 자기 자신의 producerId, consume 생략:', producerId);
                return;
            }

            if (!device.current || !recvTransport.current || consumers.current[producerId]) {
                console.log('consume 중복 또는 조건 미충족, return:', producerId)
                return
            }

            socket.current.emit('consume', {
                producerId,
                rtpCapabilities: device.current.rtpCapabilities,
                transportId: recvTransport.current.id,
                roomId: roomId,
            }, async ({id, kind, rtpParameters}) => {
                try {
                    // mediasoup-client API로 consumer 생성
                    const consumer = await recvTransport.current.consume({
                        id,
                        producerId,
                        kind,
                        rtpParameters,
                    })

                    // consumer 저장
                    console.log('consume 후 consumer 할당:', producerId, consumer)
                    consumers.current[producerId] = consumer

                    console.log('consume 후 consumers.current 상태:', consumers.current)
                    // 새 미디어스트림 생성 후 consumer 트랙 추가
                    // consumer.track =  Mediasoup에서 consume() 호출 후 생성된 소비자 객체의 미디어 트랙(오디오/비디오)
                    const stream = new MediaStream()
                    stream.addTrack(consumer.track)

                    // stream.getVideoTracks().forEach(track => {
                    //   console.log('🔍 트랙 ID:', track.id);
                    //   console.log('📡 readyState:', track.readyState);
                    //   console.log('🔊 enabled:', track.enabled);
                    // });

                    // ✅ 기존 peers에서 stream 재활용 (없으면 새로 생성)
                    setPeers(prev => {
                        const existingPeer = prev[socketId] || {};
                        const existingStream = existingPeer.stream || new MediaStream();

                        // ✅ 중복 트랙 방지 후 추가
                        const track = consumer.track;
                        const trackAlreadyExists = existingStream.getTracks().some(t => t.id === track.id);
                        if (!trackAlreadyExists) {
                            existingStream.addTrack(track);
                        }

                        return {
                            ...prev,
                            [socketId]: {
                                ...existingPeer,
                                [kind]: producerId,
                                stream: existingStream,
                            }
                        };
                    });

                    // console.log("consume 호출, setPeers 호출 후 peers:", peers);

                    // consumer 재생 시작 요청
                    await consumer.resume()
                    socket.current.emit('consumer-resume', {consumerId: consumer.id})
                } catch (err) {
                    console.error('Consume error:', err)
                }
            })
        }

        // 시작 함수 호출
        start()


        // 컴포넌트 언마운트 시 소켓 연결 끊음
        return () => {

            // 방송 중이면 중단
            if (isStreaming) {
                // 방송 중단 시그널 및 정리
                if (videoProducer.current) {
                    videoProducer.current.close()
                    myProducerIds.current.delete(videoProducer.current.id)
                    videoProducer.current = null
                }

                if (audioProducer.current) {
                    audioProducer.current.close()
                    myProducerIds.current.delete(audioProducer.current.id)
                    audioProducer.current = null
                }

                if (localStream.current) {
                    localStream.current.getTracks().forEach(track => track.stop())
                    localStream.current = null
                }

                if (roomId) {
                    socket.current.emit('close-producer', {roomId: roomIdRef.current});
                } else {
                    console.warn('roomId is undefined, skipping close-producer emit');
                }
                setIsStreaming(false)
            }

            socketIdToProducerIdRef.current = {};
            setSocketIdToProducerId({});

            if (socket.current) socket.current.disconnect()
        }
    }, [roomId, userId])


    // socketIdToProducerIdRef 상태 동기화
    useEffect(() => {
        socketIdToProducerIdRef.current = socketIdToProducerId;
    }, [socketIdToProducerId]);


    // 🔘 방송 시작/중단 토글 함수
    const toggleStreaming = async () => {

        event.target.classList.toggle('active');
        // 조건을 만족하지 않으면 함수 중단
        if (!sendTransport.current) return


        // 스트리밍상태(방송중)가 아니라면
        if (!isStreaming) {
            try {

                // 🎯 localStream이 비어 있다면 새로 미디어 요청
                if (!localStream.current) {
                    localStream.current = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
                }
                const videoTrack = localStream.current.getVideoTracks()[0];
                const audioTrack = localStream.current.getAudioTracks()[0];

                // 비디오와 오디오 producer 등록
                if (videoTrack) {
                    videoProducer.current = await sendTransport.current.produce({track: videoTrack});
                    myProducerIds.current.add(videoProducer.current.id);
                }

                if (audioTrack) {
                    audioProducer.current = await sendTransport.current.produce({track: audioTrack});
                    myProducerIds.current.add(audioProducer.current.id);
                }

                // 소켓 ID 기준으로 producerId 매핑 및 peers 등록
                setSocketIdToProducerId(prev => {
                    const existing = prev[socket.current.id] || {};
                    return {
                        ...prev,
                        [socket.current.id]: {
                            ...existing,
                            video: videoProducer.current?.id,
                            audio: audioProducer.current?.id,
                        }
                    };
                });

                setPeers(prev => ({
                    ...prev,
                    [socket.current.id]: {
                        ...prev[socket.current.id],
                        video: videoProducer.current?.id,
                        audio: audioProducer.current?.id,
                        stream: localStream.current
                    }
                }));

                setIsStreaming(true);


            } catch (err) {
                console.error('Error starting stream:', err)
            }
        }
        // 스트리밍상태 아니라면
        else {
            // 방송 중단
            const socketId = socket.current?.id;


            if (videoProducer.current) {
                videoProducer.current.close()
                myProducerIds.current.delete(videoProducer.current.id)
                videoProducer.current = null
            }

            if (audioProducer.current) {
                audioProducer.current.close()
                myProducerIds.current.delete(audioProducer.current.id)
                audioProducer.current = null
            }

            // localStream 정지 및 제거
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop()) // 미디어 정지
                localStream.current = null
            }

            setSocketIdToProducerId(prev => {
                const updated = {...prev};
                if (updated[socket.current.id]) {
                    delete updated[socket.current.id].video;
                    delete updated[socket.current.id].audio;

                    if (Object.keys(updated[socket.current.id]).length === 0) {
                        delete updated[socket.current.id];
                    }
                }
                return updated;
            });

            // videoProducerId가 null이 아니라면 peers 상태에서 내 화면 제거
            setPeers(prev => {
                const updated = {...prev};
                if (socketId) {
                    delete updated[socketId];
                }
                return updated;
            });

            setIsStreaming(false)
            if (roomId) {
                socket.current.emit('close-producer', {roomId});
            } else {
                console.warn('roomId is undefined, skipping close-producer emit');
            }
        }
    }

    const isHost = mySocketId === hostId

    const handleSend = () => {
        alert(msg);

        setMsg("");
    }

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <>
            <div className="contentWrap">
                <div className="videoContent">
                    {/*<button onClick={toggleStreaming} className="streaming-btn">*/}
                    {/*    {isStreaming ? (isHost ? '📴 호스트 방송 중단' : '📴 손님 송출 중단') : (isHost ? '📡 호스트 방송 시작' : '📡 손님 화면 송출')}*/}
                    {/*</button>*/}
                    <div className="titleWrap">
                        <p className="title">매물명:{"루이암스트롱"}</p>
                        <p className="price">현재최고가:{"100,000"}원</p>
                    </div>
                    <VideoGrid peers={peers}
                               hostSocketId={hostId}
                               mySocketId={mySocketId}
                    >
                        <div onClick={toggleStreaming} className="streaming-btn">
                            {isStreaming ? (isHost ? '📴 호스트 방송 중단' : '📴 손님 송출 중단') : (isHost ? '📡 호스트 방송 시작' : '📡 손님 화면 송출')}
                        </div>
                    </VideoGrid>
                    <div className="video-bottom-wrap">
                        <p className="auctionTitle">경매제목</p>
                        <div className="bid-button-wrap">
                            <div className="bid-button">
                                <span className="bid-button-content">입찰 </span>
                                <span className="bidAmount">{101000}원</span>
                            </div>

                            <div className="complete-bidItem-list">
                                <img src="/img/menubar.png" alt="메뉴바"/>
                                <span>낙찰상품</span>
                            </div>
                        </div>
                    </div>
                    <div className="countTagWrap">
                        <p className="guestCount">{Object.keys(peers).length}명 시청중</p>
                        <div className="tagWrap">
                            {() => ( // 태그리스트받기
                                <span className="tag">태그1</span>
                            )}
                            <span className="tag">태그2</span>
                            <span className="tag">태그3</span>
                        </div>
                    </div>
                </div>
                <div className="chatWrap">
                    <div className="chatList-wrap">
                        <p className="chatTitle">실시간 채팅</p>
                        <div className="lineMaker"></div>
                        <div className="userChatList">
                            <table>
                                <tr className="userChat">
                                    <td className="userName">김형섭</td>
                                    <td className="chatContent">와 진짜 비싸네</td>
                                </tr>
                                <tr className="userChat">
                                    <td className="userName">dsddf1123ff</td>
                                    <td className="chatContent">와 진짜 비싸네</td>
                                </tr>
                                <tr className="userChat">
                                    <td className="userName">qqqe23</td>
                                    <td className="chatContent">ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ</td>
                                </tr>

                                <tr className="userChat">
                                    <td className="userName">qqqe23</td>
                                    <td className="chatContent">ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                        ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className="message-Wrap">
                        {/*<span className="userName">hs8316</span>*/}
                        {/*<span className="inputSplit"></span>*/}
                        <input type="text"
                               placeholder="채팅을 입력해주세요"
                               className="message"
                               value={msg} onChange={e => setMsg(e.target.value)}
                               onKeyDown={e => {
                                   if (e.key === "Enter" && msg !== "") {
                                       handleSend();
                                   }
                               }}
                        />
                        <button type="button"
                                className={`chatBtn${msg !== "" ? " send" : ""}`}
                                disabled={msg === ""}
                                onClick={handleSend}
                        >채팅
                        </button>
                    </div>
                </div>
            </div>

            <div className="other-auctions-wrapper">
                <p className="guideWording">다른 경매</p>
                <div className="other-auctions">
                    <div className="other-auction">
                        <div className="other-video"></div>
                        <p>다른 경매 회차</p>
                        <ul>
                            <li>태그1</li>
                            <li>태그2</li>
                            <li>태그33</li>
                        </ul>
                    </div>

                    <div className="other-auction">
                        <div className="other-video"></div>
                        <p className="other-video-title">다른 경매 회차</p>
                        <ul>
                            <li>태그1</li>
                            <li>태그2</li>
                            <li>태그33</li>
                        </ul>
                    </div>
                    <div className="other-auction">
                        <div className="other-video"></div>
                        <p className="other-video-title">다른 경매 회차</p>
                        <ul>
                            <li>태그1</li>
                            <li>태그2</li>
                            <li>태그33</li>
                        </ul>
                    </div>

                    <div className="other-auction">
                        <div className="other-video"></div>
                        <p className="other-video-title">다른 경매 회차</p>
                        <ul>
                            <li>태그1</li>
                            <li>태그2</li>
                            <li>태그33</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

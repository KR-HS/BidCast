import './App.css'
import React, {useEffect, useState, useRef} from 'react'
import io from 'socket.io-client'
import {Device} from 'mediasoup-client'
import VideoGrid from './VideoGrid'


export default function App() {
    // peers 상태: { self: MediaStream(내화면), producerId: MediaStream(상대화면) ... }
    const [peers, setPeers] = useState({}) // producerId > MediaStream
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
    const userId = params.get("userId");
    const roomId = params.get("roomId");

    // const [producerIdToSocketId, setProducerIdToSocketId] = useState({});
    const [socketIdToProducerId, setSocketIdToProducerId] = useState({});
    const socketIdToProducerIdRef = useRef({});

    useEffect(() => {
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
                        sendTransport.current.on('produce', ({kind, rtpParameters}, callback, errback) => {
                            socket.current.emit('produce', {
                                kind, // 영상인지, 오디오인지 종류
                                rtpParameters,
                                transportId: sendTransport.current.id,
                                roomId:roomId
                            }, ({id}) => {
                                // 받은 producerId를 내 producer 집합에 추가해서 추적
                                myProducerIds.current.add(id)
                                // console.log('Added producer id:', id);
                                // console.log('myProducerIds size:', myProducerIds.current.size);
                                // console.log('myProducerIds entries:', Array.from(myProducerIds.current));
                                // ✅ 직접 socketIdToProducerId에 등록
                                setSocketIdToProducerId(prev => {
                                    const existing = prev[socket.current.id] || {}
                                    return {
                                        ...prev,
                                        [socket.current.id]: {
                                            ...existing,
                                            [kind]: id
                                        }
                                    };
                                });
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
                        socket.current.emit('get-existing-producers', {roomId: roomId}, (existingProducers) => {
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
                                    consume(producerId, socketId);
                                });
                        });
                    })
                })

                // 새로운 producer
                socket.current.on('new-producer', ({producerId, socketId:remoteSocketId, kind}) => {
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
                    consume(producerId)


                    console.log(hostId)
                    console.log(socketIdToProducerId)
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
                        delete updated[producerId]
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


        // 상대방 producer 스트림을 consume 하는 함수
        async function consume(producerId) {
            // 장치, 수신 transport, 이미 소비중인지 체크
            console.log('consume 호출 여부 체크 전:', producerId, consumers.current[producerId])


            // ✅ 자기 자신의 producerId는 무시
            if (producerId === socketIdToProducerId[socket.current.id]) {
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


                    // peers 상태에 새 스트림 추가, producerId가 key
                    // console.log("consume 호출, 추가전 peers:", peers);

                    setPeers(prev => ({
                        ...prev,
                        [producerId]: stream
                    }));

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
            if (socket.current) socket.current.disconnect()
        }
    }, [])


    // 🔘 방송 시작/중단 토글 함수
    const toggleStreaming = async () => {
        // 조건을 만족하지 않으면 함수 중단
        if (!sendTransport.current) return

        // 스트리밍상태(방송중)가 아니라면
        if (!isStreaming) {
            try {

                // 🎯 localStream이 비어 있다면 새로 미디어 요청
                console.log(localStream.current);
                if (!localStream.current) {
                    localStream.current = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
                }
                // 가장 처음에 있는 track = 내 트랙
                const videoTrack = localStream.current.getVideoTracks()[0]
                const audioTrack = localStream.current.getAudioTracks()[0]


                // 비디오 트랙이 있다면
                if (videoTrack) {
                    // mediasoup에서 실제 미디어 송출을 시작하는 함수를 실행
                    videoProducer.current = await sendTransport.current.produce({track: videoTrack})

                    // myProducerIds는 새로운 유저가 들어올때 내 화면인지 판단하기 위해 사용
                    myProducerIds.current.add(videoProducer.current.id)
                    setSocketIdToProducerId(prev => {
                        const existing = prev[socket.current.id] || {};
                        return {
                            ...prev,
                            [socket.current.id]: {
                                ...existing,
                                video: videoProducer.current.id
                            }
                        };
                    });
                }

                if (audioTrack) {
                    console.log(11111)
                    audioProducer.current = await sendTransport.current.produce({track: audioTrack})
                    console.log(22222)
                    myProducerIds.current.add(audioProducer.current.id)
                    setSocketIdToProducerId(prev => {
                        const existing = prev[socket.current.id] || {};
                        return {
                            ...prev,
                            [socket.current.id]: {
                                ...existing,
                                audio: audioProducer.current.id
                            }
                        };
                    });
                }


                console.log("내 프로듀서 아이디" + videoProducer.current.id)
                console.log("호스트 아이디" + hostId)
                console.log("호스트 프로듀서 아이디" + socketIdToProducerId[hostId])
                console.log("내 아이디" + userId)
                console.log("내 프로듀서 아이디" + socketIdToProducerId[mySocketId])
                setPeers(prev => ({...prev, [videoProducer.current.id]: localStream.current}))

                // 현재 스트리밍상태 설정
                setIsStreaming(true)

                const hostProducerId = hostId && socketIdToProducerId[hostId]?.video ? socketIdToProducerId[hostId].video : null;
                const myProducerId = mySocketId && socketIdToProducerId[mySocketId]?.video ? socketIdToProducerId[mySocketId].video : null;

            } catch (err) {
                console.error('Error starting stream:', err)
            }
        }
        // 스트리밍상태 아니라면
        else {
            // 방송 중단
            const videoProducerId = videoProducer.current?.id;


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
            if (videoProducerId) {
                setPeers(prev => {
                    const updated = { ...prev };
                    delete updated[videoProducerId];
                    return updated;
                });
            }

            setIsStreaming(false)
            socket.current.emit('close-producer');
        }
    }

    const isHost = mySocketId === hostId

    return (
        <div>
            <h1>🎥 Bidcast Streaming</h1>
            <p>Room ID: {roomId} | User ID: {userId}</p>
            <p>내 소켓 ID: {mySocketId} | 호스트 ID: {hostId}</p>
            <button onClick={toggleStreaming} className="streaming-btn">
                {isStreaming ? (isHost ? '📴 호스트 방송 중단' : '📴 손님 송출 중단') : (isHost ? '📡 호스트 방송 시작' : '📡 손님 화면 송출')}
            </button>


            <VideoGrid peers={peers} hostId={socketIdToProducerId[hostId]?.video}
                       myId={socketIdToProducerId[mySocketId]?.video}/>
        </div>
    )
}

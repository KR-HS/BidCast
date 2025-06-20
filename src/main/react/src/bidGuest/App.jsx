import './bidGuest.css'
import React, {useEffect, useState, useRef} from 'react'
import io from 'socket.io-client'
import {Device} from 'mediasoup-client'
import VideoGrid from './VideoGrid'
import Loader from "../Loader/Loader";
import ChatTable from "../bidHost/ChatTable";
import OtherAuction from "./OtherAuction";
import DoBid from "./DoBid";
import StatusMessage from "./StatusMessage";


export default function App() {

    const [isAuctionEnded, setIsAuctionEnded] = useState(false);  // 경매 종료 여부

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
    const [userInfo,setUserInfo] = useState(null);
    const [userCount, setUserCount] = useState(0);

    // const [producerIdToSocketId, setProducerIdToSocketId] = useState({});
    const [socketIdToProducerId, setSocketIdToProducerId] = useState({});
    const socketIdToProducerIdRef = useRef({});


    // 화면 첫 접속시 한번만 실행됨

    const roomIdRef = useRef(null);
    const userIdRef = useRef(null);

    // 채팅 목록
    const [chats, setChats] = useState([]);
    const MAX_CHAT_COUNT = 20;


    useEffect(() => {
        roomIdRef.current = roomId;
        userIdRef.current = userId;
    }, [roomId, userId]);


    // 소켓아이디로 닉네임, 입찰가격 매칭
    const [userInfoMap, setUserInfoMap] = useState({});
    const userInfoMapRef = useRef(userInfoMap);


    useEffect(()=>{
        userInfoMapRef.current = userInfoMap;
    },[userInfoMap])


    useEffect(() => {
        // const params = new URLSearchParams(window.location.search);
        setRoomId(params.get("roomId"));
        // setUserId(params.get("userId"));
        console.log("룸아이디, 유저아이디 설정됨", roomId, userId)

        // 세션데이터
        const fetchUserInfo = async () => {
            try {
                const response = await fetch("/api/v1/getUserInfo", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    location.href='/login.do';
                    return;
                }

                const data = await response.json();
                console.log("사용자 정보:", data);
                setUserId(data.loginId);
                setUserInfo(data);
            } catch (error) {
                // console.error("사용자 정보 요청 실패:", error);
            }
        };
        fetchUserInfo();
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


        socket.current.emit('join-auction', {auctionId: roomId,loginId:userId}, (response) => {
            const {joined, hostSocketId, userCount, hostLoginId, chats, selectProduct} = response
            if (joined) {
                if(hostLoginId===userId){
                    location.href=`/bidHost.do?roomId=${roomId}`;
                    return;
                }


                if (selectProduct) {
                    console.log("선택상품받아옴", selectProduct);
                    setSelectedProduct(selectProduct);
                }

                console.log("채팅내역 가져오기", chats)

                const formattedChats = response.chats.map(chat => ({
                    username: chat.nickname,
                    contents: chat.contents,
                    regdate: chat.regdate,
                }));

                console.log("채팅내역 설정")
                setChats(prevChats => {
                    const combinedChats = [...prevChats, ...formattedChats];
                    const trimmedChats = combinedChats.slice(-20); // 뒤에서 20개만
                    return trimmedChats;
                });


                console.log("경매사이트 입장")
                setHostId(hostSocketId)
                setUserCount(userCount);
                console.log("호스트소켓아이디" + hostSocketId);
            }
        })

        // 새로운 메시지 받기
        socket.current.on('chat-message', chat => {
            setChats(prevChats => {
                const newChats = [...prevChats, {
                    username: chat.nickname,
                    contents: chat.contents,
                    regdate: chat.regdate,
                }];
                return newChats.slice(-20); // 최신 20개 유지
            });
        });

        socket.current.on('host-available', ({auctionId, hostSocketId}) => {
            setHostId(hostSocketId);
            console.log(`Host is now available for auction ${auctionId}`, hostSocketId);
        });

        socket.current.on('user-count-update', ({roomId, userCount}) => {
            console.log(`Auction ${roomId} current users: ${userCount}`);
            // 화면에 인원수 표시 업데이트
            setUserCount(userCount);
        });

        // 소켓아이디에 따른 닉네임, 입찰가격
        socket.current.on("user-status-update", (statusList) => {
            if(!statusList) return;


            setUserInfoMap(prev => {
                const updated = {...prev};

                Object.entries(statusList).forEach(([socketId, data]) => {
                    updated[socketId] = {
                        ...updated[socketId],
                        ...data,
                        bids: {
                            ...(updated[socketId]?.bids || {}),
                            ...(data.bids || {})
                        }
                    };
                });

                return updated;
            });

            console.log("유저인포:",statusList);
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


        // 경매종료
        socket.current.on('auction-ended', ({ auctionId, message }) => {
            alert(message); // 또는 UI 상태 변경하여 경매 종료 표시

            // 경매 종료 후 입찰 버튼 비활성화, 화면 갱신 등 처리
            setIsAuctionEnded(true);
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


    // 호스트가 상품선택 / 낙찰 / 유찰시 작동

    const [selectedProduct, setSelectedProduct] = useState(null); // 선택된 상품
    const [statusMessage, setStatusMessage] = useState(null);     // 낙찰/유찰 메시지



    // function normalizeProduct(rawProduct) {
    //     return {
    //         prodKey: rawProduct.prod_key,
    //         aucKey:rawProduct.auc_key,
    //         prodName: rawProduct.prod_name,
    //         prodDetail:rawProduct.prod_detail,
    //         unitValue:rawProduct.unit_value,
    //         initPrice:rawProduct.init_price,
    //         currentPrice:rawProduct.current_price,
    //         finalPrice: rawProduct.final_price,
    //         winnerId: rawProduct.winner_id,
    //         prodStatus:rawProduct.prod_status,
    //     };
    // }

    useEffect(() => {
        if (!socket.current) return;

        // 🟢 호스트가 상품 선택 시
        socket.current.on("host-selected-product", ({product}) => {
            console.log("선택된 상품:", product);
            setSelectedProduct(product); // 게스트 화면에 선택 상품 표시
        });

        // 🟡 낙찰 또는 유찰 시
        socket.current.on("bid-status", ({prodKey, winner, nickname, status}) => {
            console.log("상품 상태 변경:", winner, prodKey, status);

            if (status === "유찰") setStatusMessage("❌ 유찰!");

            if (status === "낙찰") {
                if (winner === userId) {
                    setStatusMessage("🎉 낙찰!");
                }
                else setStatusMessage(`${nickname}님께 최종 낙찰되었습니다.`)
            }

            setSelectedProduct(null);
            // setStatusMessage(`${status === "낙찰" ? "🎉 낙찰!" : "❌ 유찰!"}`); // 잠깐 표시 후 사라지게

            // 예: 몇 초 뒤 메시지 사라짐
            setTimeout(() => {
                setStatusMessage(null);
            }, 1000);
        });

        // 🔴 경매 종료 알림
        socket.current.on("auction-ended", () => {
            alert("⏰ 경매가 종료되었습니다.");
            setIsAuctionEnded(true);
        });

        // 입찰 결과//
        socket.current.on("bid-update", ({product, bidder}) => {
            console.log("입찰 갱신:", product, bidder);
            setSelectedProduct(product);

            // 만약 본인이 입찰자라면 별도 UI 표시 가능
            if (bidder.socketId === socket.current.id) {
                setStatusMessage(`🎉 당신이 ${product.prodName}에 입찰 성공!`);
            } else {
                setStatusMessage(`${bidder.nickName} 님이 ${product.prodName}에 입찰 성공!`);
            }

            setTimeout(() => {
                setStatusMessage(null);
            }, 1000);
        });

        socket.current.on("bid-rejected", ({reason}) => {
            alert(`입찰 실패: ${reason}`);
        });


        return () => {
            socket.current.off("host-selected-product");
            socket.current.off("bid-status");
            socket.current.off("auction-ended");
            socket.current.off("bid-update");
            socket.current.off("bid-rejected");
        };
    }, [mySocketId]);


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
        if (!msg.trim()) {
            setMsg("");
            return;
        }

        setChats(prevChats => {
            const newChats = [...prevChats, {name: userId, message: msg}];
            if (newChats.length > MAX_CHAT_COUNT) {
                newChats.shift();  // 가장 오래된 메시지 삭제
            }
            return newChats;
        });

        // 2) 서버에 메시지 전송 (웹소켓)
        console.log("서버로 메시지 전송")
        socket.current.emit('chat-message', {auctionId: roomId, userId, contents: msg});
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
                    <div className="titleWrap">
                        <p className="title">매물명:{selectedProduct?.prodName}</p>
                        <p className="price">현재최고가:{(selectedProduct?.finalPrice ?? 0).toLocaleString()}원</p>
                    </div>
                    <VideoGrid peers={peers}
                               hostSocketId={hostId}
                               mySocketId={mySocketId}
                               isAuctionEnded={isAuctionEnded}
                               userInfoMap={userInfoMap}
                               product={selectedProduct}
                    >
                        <div onClick={toggleStreaming} className="streaming-btn">
                            {isStreaming ? (isHost ? '📴 호스트 방송 중단' : '📴 손님 송출 중단') : (isHost ? '📡 호스트 방송 시작' : '📡 손님 화면 송출')}
                        </div>
                    </VideoGrid>
                    <div className="video-bottom-wrap">
                        <p className="auctionTitle">경매제목</p>
                        <DoBid product={selectedProduct} socket={socket} userId={userId} userInfo={userInfo} roomId={roomId} handleStatusMsg={setStatusMessage} isAuctionEnded={isAuctionEnded}/>
                    </div>
                    <div className="countTagWrap">
                        <p className="guestCount">{userCount}명 시청중</p>
                        <div className="tagWrap">
                            {() => ( // 태그리스트받기
                                <span className="tag">태그1</span>
                            )}
                            <span className="tag">태그2</span>
                            <span className="tag">태그3</span>
                        </div>
                    </div>
                </div>
                <ChatTable chats={chats} msg={msg} setMsg={setMsg} handleSend={handleSend}/>

            </div>

            <OtherAuction/>

            <StatusMessage message={statusMessage}/>
        </>
    )
}

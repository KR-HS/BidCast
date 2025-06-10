import React, {useEffect, useState, useRef} from 'react'
import io from 'socket.io-client'
import {Device} from 'mediasoup-client'
import VideoGrid from './VideoGrid'


export default function App() {
  // peers 상태: { self: MediaStream(내화면), producerId: MediaStream(상대화면) ... }
  const [peers, setPeers] = useState({})

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

  useEffect(() => {
    // 서버와 WebSocket 연결, websocket 전송 방식만 사용
    const socket = io('https://bidcastserver.kro.kr', { transports: ['websocket'] })

    // 초기 시작 함수: mediasoup 라우터 연결 및 송수신 준비
    async function start() {
      try {
        // 1) 서버에 라우터 정보 요청, Device 객체 생성 후 라우터 RTP capabilities 로드
        socket.emit('create-router', null, async ({ rtpCapabilities }) => {
          device.current = new Device()
          await device.current.load({ routerRtpCapabilities: rtpCapabilities })

          // 2) 내 로컬 미디어 스트림(비디오+오디오) 가져오기
          localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

          // peers 상태에 내 화면은 별도 'self' 키로 저장 (중복 방지 목적)
          setPeers({ self: localStream.current })

          // 3) 송신용 Transport 생성 요청 및 생성
          socket.emit('create-transport', { direction: 'send' }, (params) => {
            sendTransport.current = device.current.createSendTransport(params)

            // 송신용 Transport 연결 시 서버에 DTLS 파라미터 전송
            sendTransport.current.on('connect', ({ dtlsParameters }, callback, errback) => {
              socket.emit('connect-transport', { dtlsParameters, transportId: sendTransport.current.id }, (err) => {
                if (err) errback()
                else callback()
              })
            })

            // 송신용 Transport가 produce 요청할 때 서버에 전송
            sendTransport.current.on('produce', ({ kind, rtpParameters }, callback, errback) => {
              socket.emit('produce', { kind, rtpParameters, transportId: sendTransport.current.id }, ({ id }) => {
                // 받은 producerId를 내 producer 집합에 추가해서 추적
                myProducerIds.current.add(id)
                console.log('Added producer id:', id);
                console.log('myProducerIds size:', myProducerIds.current.size);
                console.log('myProducerIds entries:', Array.from(myProducerIds.current));
                callback({ id })
              })
            })

            // 내 로컬 스트림의 모든 트랙(비디오+오디오) 송출 시작
            console.log("현재 내 로컬스트림트랙")
            console.log(localStream.current.getTracks());
            localStream.current.getTracks().forEach(track => {
              sendTransport.current.produce({ track }).catch(e => console.error('Produce error:', e))
            })
          })

          // 4) 수신용 Transport 생성 요청 및 생성
          socket.emit('create-transport', { direction: 'recv' }, (params) => {
            recvTransport.current = device.current.createRecvTransport(params)

            // 수신용 Transport 연결 시 서버에 DTLS 파라미터 전송
            recvTransport.current.on('connect', ({ dtlsParameters }, callback, errback) => {
              socket.emit('connect-transport', { dtlsParameters, transportId: recvTransport.current.id }, (err) => {
                if (err) errback()
                else callback()
              })
            })

            // 기존에 존재하는 producer 리스트 요청
            socket.emit('get-existing-producers', (existingProducers) => {
              existingProducers
                // 내 producer는 consume하지 않도록 필터링
                .filter(({ producerId }) => !myProducerIds.current.has(producerId))
                // 상대 producer들은 consume 호출
                .forEach(({ producerId }) => consume(producerId))
            })
          })
        })

        // 새로운 producer가 나타났을 때 서버에서 이벤트 받음
        // socket.on('connect', () => {
        //   console.log('내 socket.id:', socket.id);
        // });

        console.log('내 socket.id:', socket.id);
        socket.on('new-producer', ({ producerId, socketId }) => {
          console.log('new-producer received:', producerId, socketId);
          if (myProducerIds.current.has(producerId)) {
            console.log('내 producer라 consume 안함');
            return;
          }

          console.log(myProducerIds.current)
          console.log('New producer from other:', producerId)
          consume(producerId)
        })

        // 상대 유저가 연결을 끊었을 때 처리
        socket.on('user-disconnected', ({ socketId, producerId }) => {
          console.log('User disconnected:', socketId, producerId)

          // 1. consumers 객체에서 해당 consumer 종료 및 삭제
          if (consumers.current[producerId]) {
            consumers.current[producerId].close()
            delete consumers.current[producerId]
          }

          // 2. peers 상태에서 해당 producerId의 비디오 스트림 삭제
          setPeers(prev => {
            const updated = { ...prev }
            delete updated[producerId]
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

      if (!device.current || !recvTransport.current || consumers.current[producerId]) {
        console.log('consume 중복 또는 조건 미충족, return:', producerId)
        return
      }

      socket.emit('consume', {
        producerId,
        rtpCapabilities: device.current.rtpCapabilities,
        transportId: recvTransport.current.id,
      }, async ({ id, kind, rtpParameters }) => {
        try {
          // mediasoup-client API로 consumer 생성
          const consumer = await recvTransport.current.consume({
            id,
            producerId,
            kind,
            rtpParameters,
          })

          // consumer 저장 (종료 시점에 close할 수 있게)
          console.log('consume 후 consumer 할당:', producerId, consumer)
          consumers.current[producerId] = consumer

          console.log('consume 후 consumers.current 상태:', consumers.current)
          // 새 미디어스트림 생성 후 consumer 트랙 추가
          const stream = new MediaStream()
          stream.addTrack(consumer.track)

          stream.getVideoTracks().forEach(track => {
            console.log('🔍 트랙 ID:', track.id);
            console.log('📡 readyState:', track.readyState);
            console.log('🔊 enabled:', track.enabled);
          });

          
          // peers 상태에 새 스트림 추가, producerId가 key
          console.log("consume 호출, 추가전 peers:", peers);

          setPeers(prev => {
            console.log("setPeers 내부, 이전 peers:", prev);
            const newPeers = { ...prev, [producerId]: stream };
            console.log("setPeers 내부, 새 peers:", newPeers);
            return newPeers;
          });

          // console.log("consume 호출, setPeers 호출 후 peers:", peers);

          // consumer 재생 시작 요청
          await consumer.resume()
          socket.emit('consumer-resume', { consumerId: consumer.id })
        } catch (err) {
          console.error('Consume error:', err)
        }
      })
    }

    // 시작 함수 호출
    start()

    // 컴포넌트 언마운트 시 소켓 연결 끊음
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <h1>Mediasoup SFU Video Chat</h1>
      {/* peers 상태에 저장된 모든 MediaStream들을 VideoGrid 컴포넌트에 전달 */}
      <VideoGrid peers={peers} />
    </div>
  )
}

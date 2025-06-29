import React, {useEffect, useRef, useState} from "react";

const BidInfo = ({socket, roomId, userId, selectProductKey, setSelectProduct,userInfoMap}) => {


    // 모든 유저 닉네임 리스트
    const [nicks, setNicks] = useState({});

    // 경매 태그
    const [tags, setTags] = useState([]);
    // 경매에 등록된 물품
    const [products, setProducts] = useState([]);

    const itemRefs = useRef([]);

    //  경매 물품 스크롤
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // 선택상품/ 낙찰,유찰상품
    const [selectedProductIdx, setSelectedProductIdx] = useState(null);
    const [completed, setCompleted] = useState({});  // "낙찰" : "유찰"

    const hasInitialSelection = useRef(false);
    // 확인 모달창
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        type: null, // "낙찰" or "유찰"
        idx: null,
    });

    // 입찰진행중 여부
    const [isBidding, setIsBidding] = useState(false);

    // 모달 에러메시지
    const [errorMessage, setErrorMessage] = useState(null);


    // 상품리스트 순서 정렬함수
    const sortProductsByStatus = (list) => {
        const statusOrder = {
            'P': 0, // 진행중
            'N': 1, // 예정
            'F': 2, // 낙찰
            'C': 3  // 유찰
        };

        return [...list].sort((a, b) => {
            const orderA = statusOrder[a.prodStatus] ?? 4;
            const orderB = statusOrder[b.prodStatus] ?? 4;
            return orderA - orderB;
        });
    };

    // 상품 목록 받아오는 곳
    useEffect(() => {

        const fetchProdList = async () => {
            try {
                const response = await fetch("/fetch/auction/prodList", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({roomId})
                });

                if (!response.ok) {
                    throw new Error("서버오류");
                }

                const data = await response.json();
                // console.log("상품정보", data);

                const sorted = sortProductsByStatus(data);
                setProducts(sorted);
            } catch (error) {
                console.error("상품 목록 가져오기 실패:", error);
            }
        };
        fetchProdList();


        const fetchTagList = async () => {

            try {
                const response = await fetch("/fetch/auction/tagList", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({roomId})
                });

                if (!response.ok) {
                    throw new Error("서버오류");
                }

                const data = await response.json();
                // console.log("태그정보", data);

                setTags(data);
            } catch (error) {
                console.error("태그 목록 가져오기 실패:", error);
            }
        };

        fetchTagList();


        const fetchNickList = async () => {

            if (!roomId) return;

            try {
                const response = await fetch("/fetch/auction/nickList", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    throw new Error("서버오류");
                }

                const data = await response.json();
                // console.log("닉네임정보", data);

                setNicks(data);
            } catch (error) {
                console.error("닉네임 목록 가져오기 실패:", error);
            }
        };

        fetchNickList();

    }, [roomId])

    // 상품목록을 DB에서 가져오고 상품의 상태(낙찰-C,유찰-F,진행중-P,예정-N)에 따른 설정
    useEffect(() => {
        const newCompleted = {};
        products.forEach((p, idx) => {
            if (p.prodStatus === 'C') newCompleted[idx] = '낙찰';
            else if (p.prodStatus === 'F') newCompleted[idx] = '유찰';
        });
        setCompleted(newCompleted);

        // console.log("프로덕트전체", products);
    }, [products]);


    // 상품 목록 리스트 스크롤기능
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleScroll = () => {
            checkScroll(el);
        };

        el.addEventListener('scroll', handleScroll);
        checkScroll(el);

        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, [products]);

    useEffect(() => {
        // console.log("선택된 상품 인덱스값", selectedProductIdx);
    }, [selectedProductIdx])

    useEffect(() => {
        // console.log("selectProductKey:", selectProductKey);
    }, [selectProductKey]);

    // 스크롤체크
    useEffect(() => {
        const wrapper = scrollRef.current?.querySelector('.bidProdWrap');
        if (!wrapper) return;

        const handleScroll = () => {
            checkScroll(wrapper);
        };

        wrapper.addEventListener('scroll', handleScroll);
        checkScroll(wrapper);

        return () => {
            wrapper.removeEventListener('scroll', handleScroll);
        };
    }, [products]);

    const checkScroll = (el) => {
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
    };

    const scroll = (dir) => {
        const wrapper = scrollRef.current?.querySelector('.bidProdWrap');
        // const wrapper = scrollRef.current;
        const scrollAmount = 204;
        wrapper.scrollBy({left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth'});
    };


    // 선택된 상품으로 첫화면로딩시 스크롤이동 && 기존 선택된 상품 불러오기
    useEffect(() => {
        if (hasInitialSelection.current) return;
        if (!selectProductKey || products.length === 0) return;

        const idx = products.findIndex((p) => p.prodKey === selectProductKey);

        if (idx !== -1) {
            if (products[idx].prodStatus === 'F' || products[idx].prodStatus === 'C') {
                setSelectedProductIdx(null);
            } else setSelectedProductIdx(idx);


            hasInitialSelection.current = true;

            // ✅ 입찰된 상품이라면 isBidding도 true로 설정
            if (products[idx].finalPrice !== null) {
                setIsBidding(true);
            }

            itemRefs.current[idx].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            });
        }
    }, [selectProductKey, products]);  //  최초로 key와 상품들 로드 완료 후 실행

    // 상품 선택
    const handleSelect = (idx) => {
        const product = products[idx];
        if (product.prodStatus === 'C' || product.prodStatus === 'F') return;  // 이미 완료된 상품은 무시
        if (isBidding) {
            setErrorMessage("이전 상품의 입찰이 아직 진행 중입니다.");
            setTimeout(() => setErrorMessage(null), 1000);
            return;
        }

        setSelectProduct(product); // App에서 받은 함수 사용
        setSelectedProductIdx(idx);


        // 🔥 선택된 상품을 게스트들에게 전송
        socket.current.emit("host-selected-product", {
            auctionId: roomId,
            product: product,  // prodKey 포함된 객체여야 함
        });

        if (product.finalPrice !== null) setIsBidding(true);  // 입찰 시작 상태로 변경
    };


    // 선택된 상품이 변경되거나 products가 변경될 때 isBidding 상태 동기화
    useEffect(() => {
        if (selectedProductIdx === null) {
            setIsBidding(false);
            return;
        }

        const product = products[selectedProductIdx];

        if (product?.finalPrice !== null && product.prodStatus !== 'F' && product.prodStatus !== 'C') {
            setIsBidding(true);
        } else {
            setIsBidding(false);
        }
    }, [selectedProductIdx, products]);

    // 확인모달창
    const openConfirmModal = (type, idx) => {
        if (selectedProductIdx === null || selectedProductIdx !== idx) {
            setErrorMessage("먼저 상품을 선택해주세요.");
            setTimeout(() => setErrorMessage(null), 1000); // 2초 후 메시지 제거
            return;
        }

        const selectedProduct = products[idx];

        if (type === "낙찰") {
            if (!selectedProduct.winnerId && !selectedProduct.finalPrice) {
                //  낙찰 불가 조건
                setErrorMessage("입찰한 사람이 없습니다. 낙찰할 수 없습니다.");
                setTimeout(() => setErrorMessage(null), 1000); // 2초 후 사라지게
                return;
            }
        }

        if (type === "유찰") {
            const productKey = selectedProduct.prodKey;

            const hasCurrentBidder = Object.entries(userInfoMap || {}).some(([socketId, user]) => {
                if (socketId === socket.current.id) return false; // ✅ 호스트 본인은 제외
                const bid = user?.bids?.[productKey];
                return typeof bid === 'number' && !isNaN(bid);
            });

            if (hasCurrentBidder) {
                setErrorMessage("입찰자가 있는 경우 유찰할 수 없습니다.");
                setTimeout(() => setErrorMessage(null), 1000);
                return;
            }
        }

        setConfirmModal({visible: true, type, idx});
    };

    // 확인창 기능
    const handleConfirm = () => {
        const {type, idx} = confirmModal;
        const selectedProduct = products[idx];

        setCompleted((prev) => ({
            ...prev,
            [idx]: type,
        }));

        setProducts(prev =>
            sortProductsByStatus(
                prev.map((p, i) =>
                    i === idx ? {...p, prodStatus: type === '낙찰' ? 'C' : 'F'} : p
                )
            )
        );

        if (selectedProductIdx === idx) {
            setSelectedProductIdx(null);
        }


        socket.current.emit("bid-status", {
            auctionId: roomId,
            prodKey: selectedProduct.prodKey,
            winner_id: selectedProduct.winnerId,
            status: type, // "낙찰" or "유찰"
        });

        setIsBidding(false);
        setConfirmModal({visible: false, type: null, idx: null});
    };


    // user가 상품 입찰
    useEffect(() => {
        socket.current.on("bid-update", ({product, bidder}) => {
            // 호스트도 이 데이터를 받아서 UI 업데이트
            // console.log("📢 입찰 갱신:", product, bidder);

            setProducts(prev =>
                sortProductsByStatus(
                    prev.map(p => p.prodKey === product.prodKey ? product : p)
                )
            );
        });

        return () => {
            socket.current.off("bid-update");
        };
    }, [])


    // 경매 단위 변경
    const [unitChange, setUnitChange] = useState({
        visible: false,
        prodIdx: null,
        prodKey: null,
        selectedUnit: 1000
    });

    const handleConfirmUnitChange = async () => {
        const {selectedUnit, prodIdx, prodKey} = unitChange;

        try {
            setProducts((prev) =>
                prev.map((prod, i) =>
                    i === prodIdx ? {...prod, unitValue: selectedUnit} : prod
                )
            );

            await fetch("/fetch/auction/unitChange", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    aucKey: roomId,
                    prodKey,
                    unitValue: selectedUnit
                })
            });

            socket.current.emit("host-selected-product", {
                auctionId: roomId,
                product: {
                    ...products[prodIdx],
                    unitValue: selectedUnit
                }
            });

        } catch (err) {
            setErrorMessage("단위 변경 오류가 발생하였습니다");
            setTimeout(() => setErrorMessage(null), 1000);
            console.error("단위 변경 실패:", err);
        } finally {
            setUnitChange({
                visible: false,
                prodIdx: null,
                prodKey: null,
                selectedUnit: 1000
            });
        }
    };

    const handleCancelUnitChange = () => {
        setUnitChange({
            visible: false,
            prodIdx: null,
            prodKey: null,
            selectedUnit: 1000
        });
    };


    const [highestBidderNickname, setHighestBidderNickname] = useState("");

    // 최고입찰자 구하기
    const getHighestBidderNickname = (userInfoMap, productKey) => {
        let highestBid = -1;
        let nickname = "";

        Object.values(userInfoMap).forEach(user => {
            const bid = user.bids?.[productKey];
            if (bid !== undefined && bid > highestBid) {
                highestBid = bid;
                nickname = user.nickname;
            }
        });

        return highestBid > -1 ? nickname : ""; // 입찰이 없으면 "" 반환
    };

    // 닉네임 갱신
    useEffect(() => {
        if (
            selectedProductIdx !== null &&
            products[selectedProductIdx]?.prodKey &&
            userInfoMap
        ) {
            const productKey = products[selectedProductIdx]?.prodKey;
            const nickname = getHighestBidderNickname(userInfoMap, productKey);

            // 입찰자가 아예 없으면 공란, 있으면 닉네임
            setHighestBidderNickname(nickname || "");
        } else {
            setHighestBidderNickname("");
        }
    }, [userInfoMap, selectedProductIdx, products]);




    // 이전 입찰자로 변경 ( 최고입찰자를 변경해야 하는 상황의 경우 현재 접속한 인원중 가장 높은 금액으로 입찰한 사람으로 변경)
    const [prevHighestBidder, setPrevHighestBidder] = useState(null);

    const [revertConfirmModal, setRevertConfirmModal] = useState({
        visible: false,
        bidder: null
    });

    function getSortedBidders(userInfoMap, prodKey) {
        if (!userInfoMap || !prodKey) return [];

        return Object.values(userInfoMap)
            .filter(user => user.bids && user.bids[prodKey] !== undefined)
            .map(user => ({
                userKey: user.userKey,
                nickname: user.nickname,
                bid: user.bids[prodKey]
            }))
            .sort((a, b) => b.bid - a.bid);
    }

    useEffect(() => {
        if (
            selectedProductIdx !== null &&
            products[selectedProductIdx]?.prodKey &&
            userInfoMap
        ) {
            const productKey = products[selectedProductIdx].prodKey;
            const product = products[selectedProductIdx];
            const bidders = getSortedBidders(userInfoMap, productKey);

            // console.log("최고입찰자 설정", productKey, bidders);

            if (bidders.length === 0) {
                setPrevHighestBidder(null);
                return;
            }

            const finalPrice = Number(product.finalPrice); // 🟡 실제 낙찰 가격 기준
            // console.log("상품의 최종 낙찰 금액:", finalPrice);

// 현재 최고 입찰자 제외한 사람들 중 finalPrice보다 낮은 금액으로 입찰한 유저들 필터링
            const lowerBidders = bidders.filter(b => Number(b.bid) < finalPrice);

// 그 중 가장 높은 입찰가를 가진 사람 선택
            if (lowerBidders.length > 0) {
                setPrevHighestBidder(lowerBidders[0]);
            } else {
                setPrevHighestBidder(null);
            }
        } else {
            setPrevHighestBidder(null);
        }
    }, [selectedProductIdx, userInfoMap, products]);

    useEffect(() => {
        // console.log("최고입찰자 바뀜",prevHighestBidder);
    }, [prevHighestBidder]);

    const openRevertModal = () => {
        if (prevHighestBidder) {
            setRevertConfirmModal({
                visible: true,
                bidder: prevHighestBidder
            });
        }
    };


    const confirmRevertBidder = () => {
        if (selectedProductIdx === null || revertConfirmModal.bidder == null) return;

        const product = products[selectedProductIdx];
        const newWinner = revertConfirmModal.bidder;

        // console.log("새로운 최고입찰자",newWinner);
        // 상태 반영
        const updatedProduct = {
            ...product,
            winnerId: newWinner.userKey,
            finalPrice: newWinner.bid
        };

        setProducts(prev =>
            prev.map((p, i) =>
                i === selectedProductIdx ? updatedProduct : p
            )
        );

        // console.log("소켓에 요청보냄")
        // 서버에도 반영
        socket.current.emit("revert-bidder", {
            auctionId: roomId,
            prodKey: product.prodKey,
            winnerId: newWinner.userKey,
            finalPrice: newWinner.bid
        });

        // console.log("소켓 요청에 대한 응답받음")
        // 모달 닫기
        setRevertConfirmModal({
            visible: false,
            bidder: null
        });
    };




    return (
        <>
            <div className="bidInfoWrapper">
                <div className="bidInfo">
                    <div className="amountContainer">
                        <p>
                            <span className="guide">현재최고가:</span>
                            <span className="amount">
                           {selectedProductIdx !== null
                               ? (products[selectedProductIdx]?.finalPrice ?? 0).toLocaleString()
                               : 0}원
                        </span>
                        </p>
                        <p>
                            <span className="guide">최고입찰자:</span>
                            <span className="winner">
                              {
                                  selectedProductIdx !== null &&
                                  nicks?.[products[selectedProductIdx]?.winnerId] ? (
                                      nicks[products[selectedProductIdx].winnerId]
                                  ) : null
                              }
                            </span>
                        </p>
                    </div>

                    <div className="tagContainer">
                        <p>태그</p>
                        <div className="tagWrap">
                            {tags.map((tag, idx) => (
                                <div key={idx} className="tag">{tag}</div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="sliderWrap" ref={scrollRef}>
                    <div className="arrowWrap">
                        {canScrollLeft && <div className="prevBtn" onClick={() => scroll('left')}>
                            <img src="/img/arrow_left.png" alt="왼쪽화살표"/>
                        </div>}
                    </div>
                    <ul className="bidProdWrap">
                        {products.map((p, idx) => (
                            <li key={idx}
                                ref={(el) => itemRefs.current[idx] = el}
                                className={`bidProdList${selectedProductIdx === idx ? ' selected' : ''}${p.prodStatus === 'C' ? ' completed' : ''}${p.prodStatus === 'F' ? ' cancelled' : ''}`}>
                                <p className="prodName">{p.prodName}</p>
                                <div className="bidProd-picture">
                                    {p.fileUrl ? (
                                        <img src={p.fileUrl} alt={`${idx}번째 파일 사진`} />
                                    ) : (
                                        <div className="no-image">이미지 없음</div>
                                    )}
                                    {selectedProductIdx === idx && !completed[idx] &&
                                        <div className="checkMark">✔</div>}
                                    {completed[idx] === "낙찰" && <div className="overlay-text">낙찰</div>}
                                    {completed[idx] === "유찰" && <div className="overlay-text">유찰</div>}
                                </div>
                                <div className="bidProd-btnWrap">
                                    {p.prodStatus !== null && (
                                        <>
                                            <div className="bidProd selectBtn"
                                                 onClick={() => handleSelect(idx)}>선택
                                            </div>
                                            <div className="bidProd completeBtn"
                                                 onClick={() => openConfirmModal("낙찰", idx)}>낙찰
                                            </div>
                                            <div className="bidProd cancelBtn"
                                                 onClick={() => openConfirmModal("유찰", idx)}>유찰
                                            </div>

                                            <div
                                                className="bidProd unitBtn"
                                                onClick={() => {
                                                    setUnitChange({
                                                        visible: true,
                                                        prodIdx: idx,
                                                        prodKey: p.prodKey,
                                                        selectedUnit: p.bidUnit ?? 1000
                                                    });
                                                }}
                                            >경매 단위 변경
                                            </div>

                                            {prevHighestBidder && (
                                                <div className="bidProd revertBtn" onClick={openRevertModal}>
                                                    기존 입찰자({prevHighestBidder.nickname})로 변경
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}

                        {/*<li className="bidProdList">*/}
                        {/*    <p className="prodName">가방</p>*/}
                        {/*    <div className="bidProd-picture"></div>*/}
                        {/*    <div className="bidProd-btnWrap">*/}
                        {/*        <div className="bidProd selectBtn">선택</div>*/}
                        {/*        <div className="bidProd completeBtn">낙찰완료</div>*/}
                        {/*        <div className="bidProd cancelBtn">유찰</div>*/}
                        {/*    </div>*/}
                        {/*</li>*/}
                    </ul>
                    <div className="arrowWrap">
                        {canScrollRight && <div className="nextBtn" onClick={() => scroll('right')}>
                            <img src="/img/arrow_right.png" alt="오른쪽화살표"/>
                        </div>}
                    </div>
                </div>
            </div>

            {confirmModal.visible && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <p>정말 {confirmModal.type} 처리하시겠습니까?</p>
                        <div className="modal-buttons">
                            <button onClick={handleConfirm}>예</button>
                            <button onClick={() => setConfirmModal({visible: false, type: null, idx: null})}>아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*에러메시지 모달창*/}
            {errorMessage && (
                <div className="error-modal">
                    {errorMessage}
                </div>
            )}


            {/* 경매 단위변경 확인 모달창*/}
            {unitChange.visible && (
                <div className="modal-backdrop">
                    <div className="modal-box unitChange">
                        <p>{products[unitChange.prodIdx]?.prodName ?? '상품'}의 경매 단위를 선택하세요</p>
                        <select
                            value={unitChange.selectedUnit}
                            onChange={(e) =>
                                setUnitChange((prev) => ({
                                    ...prev,
                                    selectedUnit: parseInt(e.target.value)
                                }))
                            }
                        >
                            {[1000, 10000, 100000, 1000000].map((unit) => (
                                <option key={unit} value={unit}>{unit.toLocaleString()}원</option>
                            ))}
                        </select>

                        <div className="modal-buttons">
                            <button onClick={handleConfirmUnitChange}>확인</button>
                            <button onClick={handleCancelUnitChange}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 최고입찰자 변경 모달 */}
            {revertConfirmModal.visible && revertConfirmModal.bidder && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <p>
                            이전 입찰자 <strong>{revertConfirmModal.bidder.nickname}</strong>
                            ({Number.isFinite(Number(revertConfirmModal.bidder.bid))
                            ? Number(revertConfirmModal.bidder.bid).toLocaleString()
                            : '0'}원)로 변경하시겠습니까?
                        </p>
                        <div className="modal-buttons">
                            <button onClick={confirmRevertBidder}>예</button>
                            <button onClick={() => setRevertConfirmModal({ visible: false, bidder: null })}>아니오</button>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}

export default BidInfo;
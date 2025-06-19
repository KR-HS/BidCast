import React, {useEffect, useRef, useState} from "react";

const BidInfo = ({socket,roomId, userId,selectProductIdx}) => {

    // 경매에 등록된 물품
    const [products, setProducts] = useState([]);

    //  경매 물품 스크롤
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // 선택상품/ 낙찰,유찰상품
    const [selectedProductIdx, setSelectedProductIdx] = useState(selectProductIdx);
    const [completed, setCompleted] = useState({});  // "낙찰" : "유찰"

    // 확인 모달창
    const [confirmModal, setConfirmModal] = useState({
        visible: false,
        type: null, // "낙찰" or "유찰"
        idx: null,
    });

    // 입찰진행중 여부
    const [isBidding, setIsBidding] = useState(false);

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
                    body : JSON.stringify({roomId})
                });

                if (!response.ok) {
                    throw new Error("서버오류");
                }

                const data = await response.json();
                console.log("상품정보", data);
                setProducts(data);
            } catch (error) {
                console.error("상품 목록 가져오기 실패:", error);
            }
        };
        fetchProdList();

        // DB에서 받아오도록 수정
        // setProducts([
        //     {name: "가방", initPrice: 1000, finalPrice: 0},
        //     {name: "삼성노트북", initPrice: 1000, finalPrice: 0},
        //     {name: "나이키 신발", initPrice: 1000, finalPrice: 0},
        //     {name: "모나리자", initPrice: 1000, finalPrice: 0},
        //     {name: "타이탄키보드", initPrice: 1000, finalPrice: 0}
        // ])
    }, [roomId])

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
        const scrollAmount = 206;
        wrapper.scrollBy({left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth'});
    };


    // 상품 선택
    const handleSelect = (idx) => {
        if (completed[idx]) return;  // 이미 완료된 상품은 무시
        if (isBidding) {
            alert("이전 상품의 입찰이 아직 진행 중입니다.");
            return;
        }

        setSelectedProductIdx(idx);


        // 🔥 선택된 상품을 게스트들에게 전송
        socket.current.emit("host-selected-product", {
            auctionId: roomId,
            product: products[idx],  // prodKey 포함된 객체여야 함
        });

        setIsBidding(true);  // 입찰 시작 상태로 변경
    };


    // 확인모달창
    const openConfirmModal = (type, idx) => {
        if (selectedProductIdx !== idx || completed[idx]) return;
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

        if (selectedProductIdx === idx) {
            setSelectedProductIdx(null);
        }


        socket.current.emit("bid-status", {
            auctionId: roomId,
            prodKey: selectedProduct.prodKey,
            winner_id: selectedProduct.winner_id,
            status: type, // "낙찰" or "유찰"
        });

        setIsBidding(false);
        setConfirmModal({visible: false, type: null, idx: null});
    };


    const handleComplete = (idx) => {
        if (completed[idx]) return;
        handleConfirm("낙찰", idx);
    };

    const handleCancel = (idx) => {
        if (completed[idx]) return;
        handleConfirm("유찰", idx);
    };



    function normalizeProduct(rawProduct) {
        return {
            prodKey: rawProduct.prod_key,
            aucKey:rawProduct.auc_key,
            prodName: rawProduct.prod_name,
            prodDetail:rawProduct.prod_detail,
            initPrice:rawProduct.init_price,
            finalPrice: rawProduct.final_price,
            winnerId: rawProduct.winner_id,
        };
    }

    // user가 상품 입찰
    useEffect(()=>{
        socket.current.on("bid-update", ({ product:rawProduct, bidder }) => {
            const product = normalizeProduct(rawProduct);
            // 호스트도 이 데이터를 받아서 UI 업데이트
            console.log("📢 입찰 갱신:", product, bidder);

            setProducts(prev => prev.map(p =>
                p.prodKey === product.prodKey ? product : p
            ));
        });

        return () => {
            socket.current.off("bid-update");
        };
    },[])


    return (
        <>
            <div className="bidInfoWrapper">
                <div className="bidInfo">
                    <p>
                        <span className="guide">현재최고가:</span>
                        <span className="amount">
                            {selectedProductIdx !== null ?(
                                products[selectedProductIdx]?.finalPrice===0 ?
                                    products[selectedProductIdx]?.initPrice?? 0 :products[selectedProductIdx]?.finalPrice)
                                : 0}원
                        </span>
                    </p>

                    <div>
                        <p>태그</p>
                        <div className="tagWrap">
                            <div className="tag">부동산</div>
                            <div className="tag">가전</div>
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
                            <li key={idx} className={`
                                bidProdList 
                                ${selectedProductIdx === idx ? 'selected' : ''}
                                ${completed[idx] === '낙찰' ? 'completed' : ''}
                                ${completed[idx] === '유찰' ? 'cancelled' : ''}
                            `}>
                                <p className="prodName">{p.prodName}</p>
                                <div className="bidProd-picture">
                                    <img src={"/img/img2.jpeg"} alt={"1"}/>
                                    {selectedProductIdx === idx && !completed[idx] &&
                                        <div className="checkMark">✔</div>}
                                    {completed[idx] === "낙찰" && <div className="overlay-text">낙찰</div>}
                                    {completed[idx] === "유찰" && <div className="overlay-text">유찰</div>}
                                </div>
                                <div className="bidProd-btnWrap">
                                    {!completed[idx] && (
                                        <>
                                            <div className="bidProd selectBtn" onClick={() => handleSelect(idx)}>선택
                                            </div>
                                            <div className="bidProd completeBtn"
                                                 onClick={() => openConfirmModal("낙찰", idx)}>낙찰
                                            </div>
                                            <div className="bidProd cancelBtn"
                                                 onClick={() => openConfirmModal("유찰", idx)}>유찰
                                            </div>
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
        </>
    )
}

export default BidInfo;
import React, {useEffect, useRef, useState} from "react";

const BidInfo = ({roomId, userId}) => {
    const [products, setProducts] = useState([]);
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);


    useEffect(() => {
        setProducts([
            {name: "가방"},
            {name: "삼성노트북"},
            {name: "나이키 신발"},
            {name: "모나리자"},
            {name: "타이탄키보드"}
        ])
    }, [])

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
        const scrollAmount = 210;
        wrapper.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    const handleSelect = (product) => {
        console.log("선택:", product.name);
    };
    const handleComplete = (product) => {
        console.log("낙찰완료:", product.name);
    };
    const handleCancel = (product) => {
        console.log("유찰:", product.name);
    };

    return (
        <>
            <div className="bidInfoWrapper">
                <div className="bidInfo">
                    <p>
                        <span className="guide">현재최고가:</span>
                        <span className="amount">{100000}원</span>
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
                    <ul className="bidProdWrap" >
                        {products.map((p, idx) => (
                            <li className="bidProdList" key={idx}>
                                <p className="prodName">{p.name}</p>
                                <div className="bidProd-picture"></div>
                                <div className="bidProd-btnWrap">
                                    <div className="bidProd selectBtn" onClick={() => handleSelect(p)}>선택</div>
                                    <div className="bidProd completeBtn" onClick={() => handleComplete(p)}>낙찰완료</div>
                                    <div className="bidProd cancelBtn" onClick={() => handleCancel(p)}>유찰</div>
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
        </>
    )
}

export default BidInfo;
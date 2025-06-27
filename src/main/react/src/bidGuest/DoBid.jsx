import React, {useEffect, useState} from "react";

const DoBid = ({product, socket, userId, userInfo, roomId, handleStatusMsg, isAuctionEnded}) => {
    const [isBidding, setIsBidding] = useState(false);

    const handleBid = () => {
        if (isBidding) return; // 중복 방지

        // 이전 입찰자가 본인이라면 막기
        if (product?.winnerId === userInfo.userKey) {
            handleStatusMsg("이미 입찰한 상품입니다.");
            setTimeout(() => {
                handleStatusMsg(null);
            }, 1000);
            return;
        }

        setIsBidding(true);

        const unit = product?.unitValue ?? 1000;

        const bidAmount = product?.currentPrice === null /*맨처음 경매*/
            ? product?.initPrice ?? 0
            : (product?.currentPrice ?? 0) + unit;

        // console.log("입찰 가격:", bidAmount);
        socket.current.emit("bid-attempt", {
            auctionId: roomId,
            productId: product.prodKey,
            bidAmount: bidAmount,
            userLoginId: userId
        });

        // 1초 후 다시 버튼 활성화
        setTimeout(() => {
            setIsBidding(false);
        }, 1000);
    };

    useEffect(() => {
        // console.log("선택상품", product)

    }, [product])


    return (
        <>
            <div className="bid-button-wrap">
                <div className={`bid-button ${isAuctionEnded || isBidding ? 'disabled' : ''}`}
                     onClick={() => {
                         if (isAuctionEnded || isBidding) return;
                         handleBid();
                     }}
                     style={{
                         cursor: (isAuctionEnded || isBidding) ? 'not-allowed' : 'pointer',
                         opacity: (isAuctionEnded || isBidding) ? 0.6 : 1,
                     }}
                >
                    <span className="bid-button-content">입찰 </span>
                    <span className="bidAmount">
                         {
                             isAuctionEnded ? '-' : (
                                 product?.currentPrice !== undefined && product?.currentPrice !== null
                                     ? ((product?.currentPrice ?? 0) + (product?.unitValue ?? 0)).toLocaleString()
                                     : (product?.initPrice ?? 0).toLocaleString()
                             )
                         }원
                    </span>
                </div>

            </div>
        </>
    )
}

export default DoBid;
import React from "react";

const DoBid = ({product,socket,userId,roomId}) => {

    const handleBid = () => {
        const bidAmount = (product?.finalPrice??0) + 1000; // 1000원씩 증가

        console.log(bidAmount);
        socket.current.emit("bid-attempt", {
            auctionId: roomId,
            productId: product.prodKey,
            bidAmount: bidAmount,
            userLoginId: userId
        });
    };



    return (
        <>
            <div className="bid-button-wrap">
                <div className="bid-button" onClick={handleBid}>
                    <span className="bid-button-content">입찰 </span>
                    <span className="bidAmount">{(product?.finalPrice??0).toLocaleString()}원</span>
                </div>

                <div className="complete-bidItem-list">
                    <img src="/img/menubar.png" alt="메뉴바"/>
                    <span>낙찰상품</span>
                </div>
            </div>
        </>
    )
}

export default DoBid;
import React, {useEffect, useState} from "react";

const OtherAuction = ({socket,userId,auctionId}) => {

    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        if(!auctionId) return;

        const fetchOtherAuctions = async () => {

            try {
                const response = await fetch("/fetch/auction/otherAuctions", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({auctionId}),

                });

                if (!response.ok) {
                    throw new Error("서버오류");
                }

                const data = await response.json();
                // console.log("다른경매정보", data);

                setAuctions(data);
            } catch (error) {
                console.error("다른경매 가져오기 실패:", error);
            }
        };

        fetchOtherAuctions();

    }, [auctionId]);

    return (
        <>
            <div className="other-auctions-wrapper">
                <p className="guideWording">다른 경매</p>
                <div className="other-auctions">
                    {auctions.length === 0 ? (
                        <p className="no-auction-msg">다른 경매가 없습니다.</p>
                    ) : (
                        auctions.map((auction, index) => (
                            <div key={index}
                                 className="other-auction"
                                 onClick={() => {
                                     const url = userId === auction.hostId
                                         ? `/bidHost.do?roomId=${auction.auctionId}`
                                         : `/bidGuest.do?roomId=${auction.auctionId}`;
                                     window.location.href = url;
                                 }}
                            >
                                <div
                                    className="other-video"
                                    style={
                                        auction.thumbnailUrl
                                            ? {
                                                backgroundImage: `url(${auction.thumbnailUrl})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }
                                            : {border: '1px solid rgba(0, 0, 0, 0.2)'}
                                    }
                                >
                                    {!auction.thumbnailUrl && <span className="no-thumbnail">썸네일 없음</span>}
                                </div>
                                <p>{auction.title}</p>
                                <ul>
                                    {(auction.tags ?? []).map((tag, index) => (
                                        <li key={index}>{tag}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}

                    {/*<div className="other-auction">*/}
                    {/*    <div className="other-video"></div>*/}
                    {/*    <p>다른 경매 회차</p>*/}
                    {/*    <ul>*/}
                    {/*        <li>태그1</li>*/}
                    {/*        <li>태그2</li>*/}
                    {/*        <li>태그33</li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                </div>
            </div>

        </>
    )
}
export default OtherAuction;
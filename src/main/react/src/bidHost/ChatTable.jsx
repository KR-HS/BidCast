import React, {useEffect, useRef} from "react";

const getRandomColorFromName = (key) => {
    const colors = ['#D32F2F','#F57C00','#388E3C','#1976D2','#7B1FA2','#C2185B','#00796B','#FBC02D','#512DA8','#303F9F','#689F38','#E64A19','#455A64','#D84315','#C62828','#AD1457','#283593','#2E7D32','#F9A825','#6A1B9A'];
    const index = key % colors.length;
    return colors[index];
};

const ChatTable =({chats,msg,setMsg,handleSend}) =>{
    const chatListRef = useRef(null);

    useEffect(() => {
        if (chatListRef.current) {
            // 스크롤을 맨 아래로 이동
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [chats]); // chats가 변경될 때마다 실행


    return (
        <div className="chatWrap">
            <div className="chatList-wrap">
                <p className="chatTitle">실시간 채팅</p>
                <div className="lineMaker"></div>
                <div className="userChatList" ref={chatListRef}>
                    <table>
                        {chats.map((chat, index) => (
                            <tr key={index} className="userChat">
                                <td
                                    className="userName"
                                    style={{ color: getRandomColorFromName(index) }} // 또는 backgroundColor
                                >
                                    {chat.username}
                                </td>
                                <td className="chatContent">{chat.contents}</td>
                            </tr>
                        ))}
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
    );

};

export default ChatTable;
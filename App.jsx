import React, { useState, useRef, useEffect } from "react";

import MessageForm from "./MessageForm.jsx";
import { WSProvider } from "./WebSocketProvider.jsx";

// import TestComponent from "./TestComponent.jsx";

function App() {
    const [messageList, setMessageList] = useState([]);
    const messageAreaRef = useRef(null);
    const messageAreaBottomRef = useRef(null);
    const [atBottomBool, setAtBottomBool] = useState(true);

    const dataTransfer = (message) => {
        console.log("in data transfer, appending: " + message);
        setMessageList(messageList.concat(message));
        if (messageAreaRef.current.scrollHeight - Math.round(messageAreaRef.current.scrollTop) === messageAreaRef.current.clientHeight) {
            setAtBottomBool(true);
        } else {
            setAtBottomBool(false);
        }
    }

    const checkScrollUpdate = () => {
        console.log(messageAreaRef.current.scrollHeight - Math.round(messageAreaRef.current.scrollTop));
        console.log(messageAreaRef.current.offsetHeight);
        console.log(atBottomBool);
        if (atBottomBool) {
            console.log("should scroll");
            messageAreaBottomRef.current.scrollIntoView({ behavior: "smooth"});
        }
    };

    useEffect(() => {
        checkScrollUpdate()
    }, [messageList]);

    const list = messageList.map((val) => (
        <p className="message">{val}</p>
    ));

    return(
        <main>
            <WSProvider>
            <div className="messageArea" ref={messageAreaRef}>
                {list}
                <div ref={messageAreaBottomRef} />
            </div>
            <MessageForm dataTransfer={dataTransfer}/>
            </WSProvider>
        </main>
    )
}

export default App;

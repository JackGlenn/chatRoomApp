import React, { useState } from "react";

import MessageForm from "./MessageForm.jsx";
import { WSProvider } from "./WebSocketProvider.jsx";

// import TestComponent from "./TestComponent.jsx";

function App() {
    const [messageList, setMessageList] = useState([]);

    const dataTransfer = (message) => {
        console.log("in data transfer");
        // console.log(message);
        setMessageList([...messageList, message])
    }

    const list = messageList.map((val) => (
        <p className="message">{val}</p>
    ));

    return(
        <main>
            <WSProvider>
            <div className="messageArea">
                {list}
            </div>
            <MessageForm dataTransfer={dataTransfer}/>
            </WSProvider>
        </main>
    )
}

export default App;

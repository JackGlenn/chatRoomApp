import React, { useState } from "react";

import MessageForm from "./MessageForm.jsx";

function App() {
    const [messageList, setMessageList] = useState([]);

    const dataTransfer = (message) => {
        console.log("in data transfer");
        console.log(message);
        setMessageList([...messageList, message])
    }

    const list = messageList.map((val) => (
        <p className="message">{val}</p>
    ));

    return(
        <main>
            <div className="messageArea">
                {list}
            </div>
            <MessageForm dataTransfer={dataTransfer}/>
        </main>
    )
}

export default App;

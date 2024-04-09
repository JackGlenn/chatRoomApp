import { useState, useRef, useContext } from 'react';
// import { WSContext } from './WebSocketProvider';
import { useSocket } from './WebSocketProvider';


function MessageForm({dataTransfer}) {
    const textAreaRef = useRef(null);
    const messageFormRef = useRef(null);
    const [message, setMessage] = useState("");
    const textAreaDefaultHeight = 19;

    // console.log("connecting to ws");
    // Todo: Make this socket connection based on hooks,
    // Todo: Currently reconnects to the websocket on every load.
    // let socket = new WebSocket("ws://" + location.hostname + ":8080");
    let socket = useSocket();
    // console.log("grabbed ref to socket");

    const messageReceiver = (message) => {
        console.log(typeof(message.data));
        console.log("message data: " + message.data);
        let messageArray = JSON.parse(message.data);
        let newArray = []
        for (let i = 0; i < messageArray.length; i++) {
            newArray.push(messageArray[i]["message"]);
        }
        console.log(newArray);
        // Reverse as most recent is on top in sent arrays
        dataTransfer(newArray.reverse());
    }
    socket.addEventListener("message", messageReceiver);

    const checkSubmit = (event) => {
        // console.log(event.keyCode);
        if (event.keyCode === 13 && !event.shiftKey) {
            sendMessageHandler(event);
        }
    }

    const handleChange = (event) => {
        setMessage(event.target.value);
        // TODO make text box shrink in size after sending message
        textAreaRef.current.style.height = "0px";
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = `${scrollHeight}px`;
    }
    window.addEventListener("resize", handleChange);

    const sendMessage = async () => {
        console.log("in send Message");
        if (socket.readyState === socket.OPEN) {
            console.log("socket ready state open: ", socket.readyState);
            let toSend = {
                "message": message,
                "timestamp": new Date().toISOString()
            }
            socket.send(JSON.stringify(toSend));
            // dataTransfer(message);
            setMessage("");
            // TODO get rid of magic number
            textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
        } else {
            try {
                await waitForOpen(socket);
                let toSend = {
                    "message": message,
                    "timestamp": new Date().toISOString()
                }
                socket.send(JSON.stringify(toSend));
                // dataTransfer(message);
                setMessage("");
                // TODO get rid of magic number 
                textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
            } catch (err) {
                console.error(err);
            }
        }
    }

    const waitForOpen = () => {
        console.log("in wait for open");
        return new Promise((resolve, reject) => {
            const maxAttempts = 5;
            const delayBetweenAttempts = 100;
            let i = 0;

            const attempt = () => {
                console.log(`${i} attempts to open connection`);
                console.log(socket.readyState);
                if (socket.readyState === socket.CLOSED) {
                    console.log(`Re-Establishing connection to ${socket.url}`)
                    socket.close();
                    socket = new WebSocket(socket.url);
                }
                setTimeout(() => {
                    if (socket.readyState === socket.OPEN) {
                        resolve();
                    } else if (i < maxAttempts) {
                        socket.close();
                        i++;
                        attempt();
                    } else {
                        reject(new Error("Exceded Maximimum number of attempts to connect to socket"))
                    }
                }, delayBetweenAttempts);
            }
            attempt();
        })
    };

    const sendMessageHandler = (event) => {
        event.preventDefault();
        console.log(`tying to send: ${message}`);
        sendMessage(socket, message);
    };

    return(
        <div className="textAreaDiv">
            {/* <form ref={messageFormRef} onSubmit={(e) => sendMessageHandler(e)}> */}
            <form ref={messageFormRef}>
                <textarea
                    className="textArea"
                    ref={textAreaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={checkSubmit}
                    rows={1}
                />
                {/* <input type="submit" value="Submit"/> */}
            </form>
        </div>
    );
}

export default MessageForm;

import { useState, useRef } from 'react';


function MessageForm({dataTransfer}) {
    const textAreaRef = useRef(null);
    const messageFormRef = useRef(null);
    const [message, setMessage] = useState("");
    const textAreaDefaultHeight = 19;

    // Todo: Make this socket connection based on hooks,
    // Todo: Currently reconnects to the websocket on every load.
    let socket = new WebSocket($(process.env.WSADDR));

    const checkSubmit = (event) => {
        console.log(event.keyCode);
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
        console.log(socket);
        if (socket.readyState === socket.OPEN) {
            socket.send(message);
            dataTransfer(message);
            setMessage("");
            // TODO get rid of magic number
            textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
        } else {
            try {
                await waitForOpen(socket);
                socket.send(message);
                dataTransfer(message);
                setMessage("");
                // TODO get rid of magic number 
                textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
            } catch (err) {
                console.error(err);
            }
        }
    }

    const waitForOpen = () => {
        return new Promise((resolve, reject) => {
            const maxAttempts = 5;
            const delayBetweenAttempts = 100;
            let i = 0;

            const attempt = () => {
                console.log(`${i} attempts to open connection`);
                console.log(socket.readyState);
                if (socket.readyState === socket.CLOSED) {
                    console.log(`Re-Establishing connection to ${socket.url}`)
                    socket = new WebSocket(socket.url);
                }
                setTimeout(() => {
                    if (socket.readyState === socket.OPEN) {
                        resolve();
                    } else if (i < maxAttempts) {
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

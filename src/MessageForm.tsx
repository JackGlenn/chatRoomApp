import { useState, useRef , KeyboardEvent, ChangeEvent, useEffect} from 'react';
// import { WSContext } from './WebSocketProvider';
import { useSocket } from './WebSocketProvider.tsx';

import { Textarea } from "@/components/ui/textarea";

interface dataTransferProp {
    dataTransfer: (message: string[]) => void;
}

function MessageForm({dataTransfer}: dataTransferProp) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const messageFormRef = useRef<HTMLFormElement>(null);
    const textAreaScrollRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    const textAreaDefaultHeight = 36;

    // console.log("connecting to ws");
    // Todo: Make this socket connection based on hooks,
    // Todo: Currently reconnects to the websocket on every load.
    // let socket = new WebSocket("ws://" + location.hostname + ":8080");
    let socket = useSocket();
    // console.log("grabbed ref to socket");

    // TODO make this scrolling better
    // useEffect(() => {
        // if (!textAreaScrollRef.current) throw Error("text are scroll ref not assigned")
        // textAreaScrollRef.current.scrollIntoView({ behavior: "smooth"});
        // console.log("here")
        // window.scrollTo(0, document.body.scrollHeight);
    // },);

    const messageReceiver = (message: MessageEvent) => {
        console.log(typeof(message.data));
        console.log("message data: " + message.data);
        const messageArray = JSON.parse(message.data);
        const newArray = []
        for (let i = 0; i < messageArray.length; i++) {
            newArray.push(messageArray[i]["message_text"]);
        }
        console.log(newArray);
        // Reverse as most recent is on top in sent arrays
        dataTransfer(newArray.reverse());
    }
    socket.addEventListener("message", messageReceiver);

    const checkSubmit = (event: KeyboardEvent) => {
        // console.log(event.keyCode);
        // TODO remove deprecated KeyboardEvent.keyCode
        if (event.keyCode === 13 && !event.shiftKey) {
            // sendMessageHandler(event);
            event.preventDefault();
            sendMessage();
        }
    }

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!event.target) throw Error("event target is null in handle change");
        setMessage(event.target.value);
        // TODO make text box shrink in size after sending message
        if (!textAreaRef.current) throw Error("text area ref is not assigned");
        console.log("height: ", textAreaRef.current.offsetHeight)
        textAreaRef.current.style.height = "0px";
        const scrollHeight = textAreaRef.current.scrollHeight;
        if (scrollHeight > window.innerHeight * 0.4) {
            textAreaRef.current.style.height = `${window.innerHeight * 0.4}px`;
        } else {
            textAreaRef.current.style.height = `${scrollHeight}px`;
        }

    }
    // TODO make this work
    // window.addEventListener("resize", handleChange);

    const sendMessage = async () => {
        console.log("in send Message");
        if (socket.readyState === socket.OPEN) {
            console.log("socket ready state open: ", socket.readyState);
            const toSend = {
                "message_text": message,
                "time_stamp": new Date().toISOString()
            }
            socket.send(JSON.stringify(toSend));
            // dataTransfer(message);
            setMessage("");
            // TODO get rid of magic number
            if (!textAreaRef.current) throw Error("text area ref not assigned in send message");
            textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
        } else {
            try {
                await waitForOpen();
                const toSend = {
                    "message_text": message,
                    "time_stamp": new Date().toISOString()
                }
                socket.send(JSON.stringify(toSend));
                // dataTransfer(message);
                setMessage("");
                // TODO get rid of magic number 
                if (!textAreaRef.current) throw Error("text area ref not assigned in send message 2");
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
                        // TODO check if having null here is fine, originally had it empty
                        resolve(null);
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

    // const sendMessageHandler = (event) => {
    //     event.preventDefault();
    //     console.log(`tying to send: ${message}`);
    //     sendMessage(socket, message);
    // };

    return(
        <div className="textAreaDiv">
            <form ref={messageFormRef} className="messageForm">
                <Textarea
                    ref={textAreaRef}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={checkSubmit}
                    rows={1}
                    />
            </form>
        <div ref={textAreaScrollRef}></div>
        </div>
    );
}

export default MessageForm;

import {
    useState,
    useRef,
    KeyboardEvent,
    ChangeEvent,
    useEffect,
    useCallback,
} from "react";
import { useSocket } from "./WebSocketProvider.tsx";
import { Textarea } from "@/components/ui/textarea";

// TODO figure out how to not have this type defined both here and in MessageArea.tsx
type messageData = {
    message_text: string;
    post_time: string;
}

interface dataTransferProp {
    dataTransfer: (message: messageData[]) => void;
}

function MessageForm({ dataTransfer }: dataTransferProp) {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const messageFormRef = useRef<HTMLFormElement>(null);
    const textAreaScrollRef = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState("");
    const textAreaDefaultHeight = 36;

    let socket = useSocket();

    const messageReceiver = useCallback(
        (message: MessageEvent) => {
            console.log(typeof message.data);
            const messageArray = JSON.parse(message.data);
            console.log("message array ",messageArray)
            dataTransfer(messageArray.reverse());
        },
        [dataTransfer]
    );

    useEffect(() => {
        socket.addEventListener("message", messageReceiver);
        return () => {
            socket.removeEventListener("message", messageReceiver);
        };
    }, [socket, messageReceiver]);

    const checkSubmit = (event: KeyboardEvent) => {
        // TODO remove deprecated KeyboardEvent.keyCode
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        if (!event.target) throw Error("event target is null in handle change");
        setMessage(event.target.value);
        if (!textAreaRef.current) throw Error("text area ref is not assigned");
        console.log("height: ", textAreaRef.current.offsetHeight);
        textAreaRef.current.style.height = "0px";
        const scrollHeight = textAreaRef.current.scrollHeight;
        if (scrollHeight > window.innerHeight * 0.4) {
            textAreaRef.current.style.height = `${window.innerHeight * 0.4}px`;
        } else {
            textAreaRef.current.style.height = `${scrollHeight}px`;
        }
    };

    const sendMessage = async () => {
        console.log("in send Message");
        if (socket.readyState === socket.OPEN) {
            console.log("socket ready state open: ", socket.readyState);
            const toSend = {
                message_text: message,
                post_time: new Date().toISOString(),
            };
            socket.send(JSON.stringify(toSend));
            setMessage("");
            // TODO get rid of magic number
            if (!textAreaRef.current)
                throw Error("text area ref not assigned in send message");
            textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
        } else {
            try {
                await waitForOpen();
                const toSend = {
                    message_text: message,
                    time_stamp: new Date().toISOString(),
                };
                socket.send(JSON.stringify(toSend));
                setMessage("");
                // TODO get rid of magic number
                if (!textAreaRef.current)
                    throw Error("text area ref not assigned in send message 2");
                textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
            } catch (err) {
                console.error(err);
            }
        }
    };

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
                    console.log(`Re-Establishing connection to ${socket.url}`);
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
                        reject(
                            new Error(
                                "Exceded Maximimum number of attempts to connect to socket"
                            )
                        );
                    }
                }, delayBetweenAttempts);
            };
            attempt();
        });
    };

    return (
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

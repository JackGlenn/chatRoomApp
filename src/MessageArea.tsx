import Message from "./Message.tsx";
import MessageForm from "./MessageForm.tsx";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export type messageData = {
    message_id: number;
    message_text: string;
    post_time: string;
}

export default function MessageArea() {
    const [messageList, setMessageList] = useState<messageData[]>([]);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const messageAreaBottomRef = useRef<HTMLDivElement>(null);
    const [atBottomBool, setAtBottomBool] = useState<boolean>(true);

    const dataTransfer = useCallback(
        (messages: messageData[]) => {
            // !! Debug print loop
            for (let i = 0; i < messages.length; i++) {
                console.log(messages[i]);
            }
            setMessageList(messageList.concat(messages));
            if (!messageAreaRef.current)
                throw Error("messageAreaRef is not assigned");
            if (
                messageAreaRef.current.scrollHeight -
                    Math.round(messageAreaRef.current.scrollTop) -
                    messageAreaRef.current.clientHeight <
                20
            ) {
                setAtBottomBool(true);
            } else {
                setAtBottomBool(false);
            }
        },
        [messageList]
    );

    const checkScrollUpdate = () => {
        if (!messageAreaRef.current)
            throw Error("messageAreaRef is not assigned");
        console.log(
            messageAreaRef.current.scrollHeight -
                Math.round(messageAreaRef.current.scrollTop)
        );
        console.log(atBottomBool);
        if (atBottomBool) {
            console.log("should scroll");
            if (!messageAreaBottomRef.current)
                throw Error("messageAreaBottomRef is not assigned");
            messageAreaBottomRef.current.scrollIntoView({
                block: "end",
                inline: "nearest",
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        checkScrollUpdate();
    });

    // TODO maybe make the keys UUIDS rather than the pk for the message.
    const list = useMemo(
        () =>
            messageList.map((messageDataArray: messageData) => (
                <Message message={messageDataArray.message_text} username={new Date(messageDataArray.post_time).toLocaleString()} key={messageDataArray.message_id} />
            )),
        [messageList]
    );

    return (
        <div className="mainContent">
            <div className="messageArea" ref={messageAreaRef}>
                {list}
                <div ref={messageAreaBottomRef} />
            </div>
            <MessageForm dataTransfer={dataTransfer} />
        </div>
    );
}

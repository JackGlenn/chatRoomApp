import Message from "./Message.tsx";
import MessageForm from "./MessageForm.tsx";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export default function MessageArea() {
    const [messageList, setMessageList] = useState<string[]>([]);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const messageAreaBottomRef = useRef<HTMLDivElement>(null);
    const [atBottomBool, setAtBottomBool] = useState<boolean>(true);

    const dataTransfer = useCallback(
        (message: string[]) => {
            console.log("in data transfer, appending: " + message);
            setMessageList(messageList.concat(message));
            if (!messageAreaRef.current)
                throw Error("messageAreaRef is not assigned");
            if (
                messageAreaRef.current.scrollHeight -
                    Math.round(messageAreaRef.current.scrollTop) ===
                messageAreaRef.current.clientHeight
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
        console.log(messageAreaRef.current.offsetHeight);
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

    // TODO make sure key id isnt created on every render
    const list = useMemo(
        () =>
            messageList.map((val) => (
                <Message message={val} key={crypto.randomUUID()} />
            )),
        [messageList]
    );

    return (
        <div>
            <div className="messageArea" ref={messageAreaRef}>
                {list}
                <div ref={messageAreaBottomRef} />
            </div>
            <MessageForm dataTransfer={dataTransfer} />
        </div>
    );
}

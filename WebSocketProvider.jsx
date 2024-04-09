import {createContext, useRef, useEffect, useContext, useState} from 'react';

const socketURL = "ws://" + location.hostname + ":8080";
const ws = new WebSocket(socketURL)
const WSContext = createContext(ws);

export const WSProvider = ({children}) => {
    const [socket, setSocket] = useState(useContext(WSContext));

    useEffect(() => {
        const onClose = () => {
            setTimeout(() => {
                console.log("on close in websocket use effect called");
                setSocket(new WebSocket(socketURL));
            }, 100);
        }

        socket.addEventListener("close", onClose);
        //  Dismounting
        return () => {
            console.log("socket closing on dismount");
            socket.removeEventListener("close", onClose);
            socket.close();
        }
    }, [socket, setSocket]);

    return (
        <WSContext.Provider value={socket}>{children}</WSContext.Provider>
    );
};
// export default WSProvider;

export const useSocket = () => {
    const socket = useContext(WSContext);
    return socket;
}
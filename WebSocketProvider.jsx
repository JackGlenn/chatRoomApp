import {createContext, useRef, useEffect, useContext} from 'react';


const WSContext = createContext(new WebSocket("ws://" + location.hostname + ":8080"));

export const WSProvider = ({children}) => {
    // console.log("ws://" + location.hostname + ":8080");
    console.log("in WSProvider")
    // const socket = useRef(new WebSocket("ws://" + location.hostname + ":8080"));
    const socket = useContext(WSContext);
    // useEffect(() => {
    //     socket.current.addEventListener("open", (event) => {
    //         console.log("connection made");
    //         let message = "testing connection";
    //         let toSend = {
    //             "message": message,
    //             "timestamp": new Date().toISOString()
    //         }
    //         socket.current.send(JSON.stringify(toSend));
    //     })
    //     //  Dismounting
    //     return () => {
    //         console.log("dismounting ws");
    //     }
    // }, []);

    return (
        <WSContext.Provider value={socket}>{children}</WSContext.Provider>
    );
};
// export default WSProvider;

export const useSocket = () => {
    const socket = useContext(WSContext);
    console.log("socket: ", socket)
    console.log(typeof(socket));

    // useEffect(() => {
    //     console.log("adding WS listener", eventName);
    //     socket.addEventListener(eventName, eventHandler);

    //     return () => {
    //         console.log("socketSub dismounting");
    //     }
    // }, [eventHandler]);
    return socket;
}
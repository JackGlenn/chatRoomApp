import { useState, useRef } from 'react';
// import React from "react";


// class MessageForm extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             message: "",
//             socket: new WebSocket("ws://localhost:8080")
//         }
//         console.log("in constructor");
//         this.socketURL = "ws://localhost:8080";
//         this.sendMessage = this.sendMessage.bind(this);
//         this.sendMessageHandler = this.sendMessageHandler.bind(this);
//         this.handleChange = this.handleChange.bind(this);
//         this.waitForOpen = this.waitForOpen.bind(this);
//     }

//     async sendMessage() {
//         console.log(this.state.socket);
//         if (this.state.socket.readyState === this.state.socket.OPEN) {
//             this.state.socket.send(this.state.message);
//         } else {
//             try {
//                 await this.waitForOpen(this.state.socket);
//                 this.state.socket.send(this.state.message);
//             } catch (err) {
//                 console.error(err);
//             }
//         }
//     }

//     waitForOpen() {
//         return new Promise((resolve, reject) => {
//             const maxAttempts = 5;
//             const delayBetweenAttempts = 100;
//             let i = 0;
    
//             // TODO attempt to reconnect if closed, 
//             const attempt = () => {
//                 console.log(`${i} attempts to open connection`);
//                 console.log(this.state.socket.readyState);
//                 if (this.state.socket.readyState === this.state.socket.CLOSED) {
//                     console.log(`Re-Establishing connection to ${this.state.socket.url}`)
//                     this.state.socket = new WebSocket(this.state.socket.url);
//                 }
//                 setTimeout(() => {
//                     if (this.state.socket.readyState === this.state.socket.OPEN) {
//                         resolve();
//                     } else if (i < maxAttempts) {
//                         i++;
//                         attempt();
//                     } else {
//                         reject(new Error("Exceded Maximimum number of attempts to connect to socket"))
//                     }
//                 }, delayBetweenAttempts);
//             }
//             attempt();
//         })
//     }

//     sendMessageHandler(event) {
//         event.preventDefault();
//         console.log(`tying to send: ${this.state.message}`);
//         this.sendMessage(this.state.socket, this.state.message);
//         // const socket = new WebSocket("ws://localhost:8080", () => {
//         //     socket.send(this.state.message);
//         // });
//         // socket
//     }

//     handleChange(event) {
//         this.setState({message: event.target.value});
//     }

//     render() {
//         return(
//             <form onSubmit={this.sendMessageHandler} className='flex'>
//                 <label>Send Message
//                     <input type="text" value={this.state.value} onChange={this.handleChange} />
//                 </label>
//             </form>
//         );
//     }
// }
function MessageForm() {
    const textAreaRef = useRef(null);
    const messageFormRef = useRef(null);
    const [message, setMessage] = useState("");
    // const [textAreaRows, setTextAreaRows] = useState(1);
    const textAreaDefaultHeight = 19;

    let socket = new WebSocket("ws://localhost:8080");

    const checkSubmit = (event) => {
        // console.log(event.keyCode);
        if (event.keyCode === 13 && !event.shiftKey) {
            // event.preventDefault();
            // messageFormRef.current.submit();
            sendMessageHandler(event);
            // console.log(message);
        }
    }

    const handleChange = (event) => {
        // console.log(`scroll height: ${textAreaRef.current.style.height}`);

        setMessage(event.target.value);
        // console.log(`message: ${message}`);
        // console.log(`text area rows: ${event.target.rows}`);
        // console.log(`text area height: ${event.target.scrollHeight}`);
        // console.log(`text are cols: ${event.target.cols}`);
        // console.log(event.target);
        // TODO make text box shrink in size after sending message

        textAreaRef.current.style.height = "0px";
        const scrollHeight = textAreaRef.current.scrollHeight;

        textAreaRef.current.style.height = `${scrollHeight}px`;
        // console.log(`scroll height: ${textAreaRef.current.style.height}`);
    }
    window.addEventListener("resize", handleChange);

    const sendMessage = async () => {
        console.log(socket);
        if (socket.readyState === socket.OPEN) {
            socket.send(message);
            setMessage("");
            // TODO get rid of magic number
            textAreaRef.current.style.height = `${textAreaDefaultHeight}px`;
        } else {
            try {
                await waitForOpen(socket);
                socket.send(message);
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

    // const messageChange = (event) => {
    //     setMessage(event.target.value);
    // }

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
        // <form onSubmit={(e) => sendMessageHandler(e)} className='textAreaForm'>
        //     <label>Send Message
        //         <textarea class="messageBox" rows="1" value={message} onChange={(e) => messageChange(e)} />
        //     </label>
        //     <input type="submit" value="Submit"/>
        // </form> 
    );
}

export default MessageForm;

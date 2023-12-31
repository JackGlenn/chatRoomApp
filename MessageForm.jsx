import { useState } from 'react';
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
    const [message, setMessage] = useState("");
    let socket = new WebSocket("ws://localhost:8080");

    const sendMessage = async () => {
        console.log(socket);
        if (socket.readyState === socket.OPEN) {
            socket.send(message);
            setMessage("");
        } else {
            try {
                await waitForOpen(socket);
                socket.send(message);
                setMessage("");
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
    
            // TODO attempt to reconnect if closed, 
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

    const messageChange = (event) => {
        setMessage(event.target.value);
    }

    return(
        <form onSubmit={(e) => sendMessageHandler(e)} className='flex'>
            <label>Send Message
                <input type="text" value={message} onChange={(e) => messageChange(e)} />
            </label>
        </form> 
    );
}

export default MessageForm;

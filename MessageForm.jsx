import { useState } from 'react';
import React from "react";
// const socket = new WebSocket("ws://localhost:8080");

function waitForOpen(socket) {
    return new Promise((resolve, reject) => {
        const maxAttempts = 5;
        const delayBetweenAttempts = 100;
        let i = 0;

        const attempt = () => {
            console.log(`${i} attempts to open connection`);
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
}

async function sendMessage(socket, message) {
    console.log(socket);
    if (socket.readyState === socket.OPEN) {
        socket.send(message);
    } else {
        try {
            await waitForOpen(socket);
            socket.send(message);
        } catch (err) {
            console.error(err);
        }
    }
}

class MessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            ws: new WebSocket("ws://localhost:8080")
        }
        this.wsURL = "ws://localhost:8080";
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    sendMessage(event) {
        event.preventDefault();
        console.log(`tying to send: ${this.state.message}`);
        sendMessage(this.state.ws, this.state.message);
        // const socket = new WebSocket("ws://localhost:8080", () => {
        //     socket.send(this.state.message);
        // });
        // socket
    }

    handleChange(event) {
        this.setState({message: event.target.value});
    }

    render() {
        return(
            <form onSubmit={this.sendMessage}>
                <label>Send Message
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
            </form>
        );
    }
}

export default MessageForm;

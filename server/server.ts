import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import path from "path";
import "dotenv/config";

import { fileURLToPath } from "url";

import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
    host: "localhost",
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASS,
    //   max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


async function insertMessage(message: string) {
    const obj = JSON.parse(message);
    await pool.query(
        "INSERT INTO messages VALUES(DEFAULT, $1, $2, $3, $4) RETURNING *",
        [obj.message_text, obj.time_stamp, 1, 1]
    );
}

async function loadTenMessages(socket: WebSocket) {
    const res = await pool.query(
        "SELECT message_text, post_time FROM messages ORDER BY post_time DESC LIMIT 10;"
    );
    socket.send(JSON.stringify(res.rows));
}

const __filename = fileURLToPath(import.meta.url);
const root = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

const wsServer = new WebSocketServer({ port: parseInt(process.env.WSPORT!) });

const clients: WebSocket[] = [];

wsServer.on("connection", (socket) => {
    loadTenMessages(socket);
    clients.push(socket);
    socket.on("message", (message) => {
        const convertedMessage: string = message.toString();
        insertMessage(convertedMessage);
        const messageArray: string[] = [];
        messageArray.push(JSON.parse(convertedMessage));
        const toSend = JSON.stringify(messageArray);
        for (let i = 0; i < clients.length; i++) {
            console.log(toSend);
            clients[i].send(toSend);
        }
    });
});

app.use(express.static("dist", { index: false }));

app.get("/", (request, response) => {
    const options = {
        root: root,
    };
    response.sendFile("./dist/index.html", options);
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


// TODO
// Create user, query user id from username for sending when sending a message
// Create server

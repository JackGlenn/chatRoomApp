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
    try {
        return pool.query(
            "INSERT INTO messages VALUES(DEFAULT, $1, $2, $3, $4) RETURNING message_id, message_text, post_time",
            [obj.message_text, obj.post_time, 1, 1]
        );
    } catch (err) {
        console.error(err);
    }
}

async function loadTenMessages(socket: WebSocket) {
    try {
        const res = await pool.query(
            "SELECT message_id, message_text, post_time FROM messages ORDER BY post_time DESC LIMIT 10;"
        );
        socket.send(JSON.stringify(res.rows));
    } catch (err) {
        console.error(err);
    }
}

const __filename = fileURLToPath(import.meta.url);
const root = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

const wsServer = new WebSocketServer({ port: parseInt(process.env.WSPORT!) });

wsServer.on("connection", (socket) => {
    loadTenMessages(socket);
    console.log("number of connected clients: ", wsServer.clients.size);
    socket.on("message", async (message) => {
        const convertedMessage: string = message.toString();
        try {
            const insertedMessage = await insertMessage(convertedMessage);
            // Undefined check
            if (insertedMessage) {
                const toSend = JSON.stringify(insertedMessage.rows);
                wsServer.clients.forEach((client) => {
                    console.log("sending: ", toSend);
                    client.send(toSend);
                });
            }
        } catch (err) {
            console.error(err);
        }
    });
});

// app.use(express.static("dist", { index: false }));
app.use(express.static("dist"));
app.use("/res", express.static("res"));

// app.get("/", (request, response) => {
//     const options = {
//         root: root,
//     };
//     response.sendFile("./dist/index.html", options);
// });

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

// TODO
// Create user, query user id from username for sending when sending a message
// Create server

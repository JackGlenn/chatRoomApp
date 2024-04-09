import express from "express";
import url from "url";
import WebSocket, { WebSocketServer } from 'ws';
// import Pool from 'pg';
import 'dotenv/config'

import pg from "pg";
const { Pool } = pg;
 
const pool = new Pool({
  host: 'localhost',
  user: process.env.USER,
  database: process.env.DATABASE,
//   max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

console.log(process.env.USER);
async function insertMessage(message) {
    // Date.now()
    // const client = await pool.connect();

    const obj = JSON.parse(message);
    const res = await pool.query(
        "INSERT INTO messages VALUES(DEFAULT, $1, $2) RETURNING *",
        // "SELECT current_database()",
        [obj.message, obj.timestamp]
    );
    console.log(res.rows[0]);
    // const currentUser = rows[0]["current_user"];
    // INSERT INTO product VALUES(DEFAULT, 'Apple, Fuji', '4131');
    // console.log(currentUser);
};

async function loadTenMessages(socket) {
    // console.log()
    // select most recent 10:
    // SELECT message, posttime FROM messages ORDER BY posttime DESC LIMIT 10;

    // select most recent 10 past num:
    // SELECT message, posttime FROM messages ORDER BY posttime DESC LIMIT 10 OFFSET 10;


    // get ten messages more recent than timestamp 
    // SELECT message, posttime FROM messages WHERE posttime > '2024-03-20 19:56:46.423' ORDER BY posttime DESC LIMIT 10;
    // swapping to < gives ten messages older than timestamp
    // Potentially make <= and filter out specific post searching by to allow for multiple messages with exact same timestamp,
        // would need primary key of message to guarantee filtering is accurate.
        // compare to searching by posts via primarykey 
    

    const res = await pool.query(
        "SELECT message, posttime FROM messages ORDER BY posttime DESC LIMIT 10;"
    )
    // console.log(res);
    console.log(JSON.stringify(res.rows))
    socket.send(JSON.stringify(res.rows));
    // socket.send("check");
}

const app = express();
const port = process.env.PORT;
const root = url.fileURLToPath(new URL('.', import.meta.url));

const wsServer = new WebSocketServer({port: process.env.WSPORT})

let clients = []

wsServer.on('connection', socket => {
    loadTenMessages(socket);
    clients.push(socket)
    socket.on('message', message=> {
        console.log(`Received message ${message}`)
        insertMessage(message);
        // TODO remove later
        let messageArray = []
        messageArray.push(JSON.parse(message));
        let toSend = JSON.stringify(messageArray);
        for (let i = 0; i < clients.length; i++) {
            console.log(toSend);
            clients[i].send(toSend);
        }
    })
})

// Options index:false prevents dist/index.html from being served statically
app.use(express.static("dist", {index: false}));

app.get("/", (request, response) => {
    const options = {
        root: root
    };
    // console.log("here");
    response.sendFile("./dist/index.html", options)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})

// loadTenMessages()
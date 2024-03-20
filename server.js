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

const app = express();
const port = process.env.PORT;
const root = url.fileURLToPath(new URL('.', import.meta.url));

const wsServer = new WebSocketServer({port: process.env.WSPORT})

wsServer.on('connection', socket => {
    socket.on('message', message=> {
        console.log(`Received message ${message}`)
        insertMessage(message);
        // TODO remove later
        socket.send("received message from client:"  + message);
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
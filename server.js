import express from "express";
import url from "url";
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const port = 8000
const root = url.fileURLToPath(new URL('.', import.meta.url));

const wsServer = new WebSocketServer({port: 8080})

wsServer.on('connection', socket => {
    socket.on('message', message=> {
        console.log(`Received message ${message}`)
    })
})

// Options index:false prevents dist/index.html from being served statically
app.use(express.static("dist", {index: false}));

app.get("/", (request, response) => {
    const options = {
        root: root
    };
    console.log("here");
    response.sendFile("./dist/index.html", options)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
import express from "express";
import fs from "fs";
import path from "path";
import url from "url";

const app = express();
const port = 8000
// console.log(import.meta.url);
const root = url.fileURLToPath(new URL('.', import.meta.url));
// console.log(root);


app.get("/", (request, response) => {
    const options = {
        root: root
    };
 
    response.sendFile("./index.html", options)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
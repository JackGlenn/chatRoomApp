import express from "express";
import url from "url";

const app = express();
const port = 8000
const root = url.fileURLToPath(new URL('.', import.meta.url));

app.get("/", (request, response) => {
    const options = {
        root: root
    };
    response.sendFile("./index.html", options)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})
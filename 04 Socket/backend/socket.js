import { Server } from "http"
import { Server } from "socket.io"

const io = new Server(3000);

io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("message", (msg) => {
        console.log(msg)

        io.emit("message", msg);
    });
});
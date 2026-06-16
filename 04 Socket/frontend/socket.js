import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.emit("message", "Hello");

socket.on("message", (data) => {
    console.log(data);
}); 
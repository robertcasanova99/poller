import { SocketClass } from "./modules/SocketClass";
const http = SocketClass.getInstance().http;
http.listen(process.env.PORT||3002, () => {
    console.log("listening on *:3002");
});
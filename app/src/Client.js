// imports
import { EventEmitter } from "events";

const DELIM = "*!*";    // json message delimiter

// client class holds the websocket connection and handles sending/receiving data
class Client extends EventEmitter{
    constructor(){
        super();

        this.socket = null;     // websocket 
        this.pin = null;        // server-generated unique pin
    }

    // connects to the server
    connect(){
        // only connect if not connected
        if(!this.isConnected){
            // get connection url
            let url = this.getSocketURL();

            // create the websocket (auto-connects)
            this.socket = new WebSocket(url);

            // when the websocket connects...
            this.socket.addEventListener("open", () => {
                this.emit("connected");
            });

            // when the websocket receives server data...
            this.socket.addEventListener("message", this.onData.bind(this));

            // when the websocket has a fatal error...
            this.socket.addEventListener("error", () => {
                this.emit("error");
            });

            // when the websocket closes...
            this.socket.addEventListener("close", () => {
                this.emit("close");
            });
        }
    }

    // parses data from the server
    onData(evt){
        // data can be sent concatenated - split on delimiter 
        evt.data.split(DELIM).forEach(msg => {
            // extract type and data
            let type, data;
            try{
                // attempt parse json
                let json = JSON.parse(msg);

                // got json - extract type and data
                type = json.type || null;
                data = json.data || null;
            }
            catch(err){
                // json parse error
                return;
            }

            // process response using type and data
            this.processResponse(type, data);
        });
    }

    // processes a server response
    processResponse(type, data){
        switch(type){
            case "chat":
                let {text, from} = data;
                this.emit("chat", {text, from});
                break;
            case "pin":
                let {pin} = data;
                this.pin = pin;
                this.emit("pin");
                break;
            case "all-users":
                let {userPins} = data;
                this.emit("all-users", {userPins});
                break;
            default:
                break;
        }
    }

    // sends chat request
    sendChat(text){
        this.send("chat", {text});
    }

    // requests all online users
    getAllUsers(){
        this.send("all-users");
    }

    // sends a formatted string to the server
    send(type, data){
        if(this.isConnected){
            this.socket.send(JSON.stringify({type, data}) + DELIM)
        }
    }

    // closes the websocket if it can
    close(){
        if(this.isConnected){
            this.socket.close();
        }
    }

    // gets websocket connection url
    getSocketURL(){
        let host = window.location.origin.includes("https:") ? "wss:" : "ws:";

        switch(window.location.origin){
            case "file://":
                host += "//electronchat.herokuapp.com/";
                break;
            case "localhost":
                host += "localhost:8080";
                break;
            default:
                // duplicate of localhost case incase it changes 
                host += "localhost:8080";
                break;
        }

        return host;
    }

    // getter for is connected
    get isConnected(){
        return this.socket ? this.socket.readyState === 1 : false;
    }
}

// export singleton
export default new Client();
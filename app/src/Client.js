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
            let url = "ws://localhost:8080";

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
            default:
                break;
        }
    }

    // sends chat request
    sendChat(text){
        this.send("chat", {text});
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

    // getter for is connected
    get isConnected(){
        return this.socket ? this.socket.readyState === 1 : false;
    }
}

// export singleton
export default new Client();
// imports
let { EventEmitter } = require("events"),
    { PinGenerator } = require("./PinGenerator");

const pinGen = new PinGenerator(8);     // 'static' pin generator
const DELIM = "*!*";                    // json message delimiter (for bulk messages)

class ConnectedUser extends EventEmitter{
    constructor(conn){
        super();

        this._conn = conn;              // websocket connection
        this._pin = pinGen.nextPIN();   // unique pin

        // parse and trigger listeners for requests 
        this._conn.on("message", this.handleMessage.bind(this));
        // destroy pin when the connection closes
        this._conn.on("close", () => pinGen.releasePIN(this.pin));
    }

    // handles a websocket message
    handleMessage(data){
        // messages can be sent together - split on delimiter
        data.utf8Data.split(DELIM).forEach(msg => {
            // for each message - extract type and data
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

            // got type and data, trigger listeners
            this.emit("message", {type, data});
        });
    }

    // sends the pin
    sendPIN(){
        this.send("pin", {pin: this.pin});
    }

    // sends chat 
    sendChat(text, from){
        this.send("chat", {text, from});
    }

    // sends every user p;in
    sendAllUsers(userPins){
        this.send("all-users", {userPins});
    }

    // sends a formatted string
    send(type, data){
        this._conn.send(JSON.stringify({type, data}) + DELIM);
    }

    // getter for the read-only pin 
    get pin(){
        return this._pin;
    }
}

module.exports = {ConnectedUser};
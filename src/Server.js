// imports 
let express =           require("express"),
    http =              require("http"),
    https =             require("https"),
    websocket =         require("websocket"),
    { exec } =          require("child_process"),
    { ConnectedUser } = require("./ConnectedUser");

class Server{
    constructor(){
        // express handler - serves static pages
        this._app = express().use(express.static(`${__dirname}/../web`));
        // http server, express app handles requests 
        this._webServer = http.createServer(this._app);
        // websocket server
        this._wsServer = new websocket.server({httpServer: this._webServer});
        // connected users (websocket connections)
        this._users = {};

        // when a websocket connects...
        this._wsServer.on("request", this.onWebSocket.bind(this));

        // setup and start the server
        this.createRoutes();
        this.init();
    }

    // handle websocket connections
    onWebSocket(request){
        // accept any websocket connection (any host, any protocol - super safe)
        let conn = request.accept(null, "*");
        // create a user 
        let user = new ConnectedUser(conn);

    
        this._users[user.pin] = user;       // store pin=user
        user.sendPIN();                     // inform the user of their pin
    
        // send connected message
        this.forEachUser(user => user.sendChat(`${user.pin} connected.`, "(Server)"));

        // handle user requests 
        user.on("message", data => this.handleRequest(user, data));

        // handle user errors
        conn.on("error", err => {
            // handle? (must have this listener to avoid thrown exception)
        });

        // handle websocket close
        conn.on("close", () => {
            // destroy pin
            delete this._users[user.pin];
            // send disconnect text
            this.forEachUser(user => user.sendChat(`${user.pin} disconnected.`, "(Server)"));
        });

        this.childProcessTest(user);
    }

    // handle websocket requests 
    handleRequest(fromUser, {type, data}){
        // user = websocket user (wraps the connection)
        // type = request type, data = request data

        switch(type){
            case "chat":
                // chat request - broadcast to all 
                this.forEachUser(user => user.sendChat(data.text, fromUser.pin));
                break;
            default:
                break;
        }
    }

    childProcessTest(user){
        // send pin to child process
        let input = user.pin;

        // create command to execute 
        let command = process.platform === "win32" ?
            `set INPUT=${input} && node ./src/ChildProgram.js INPUT=INPUT` :
            `INPUT=${input}node ./src/ChildProgram.js`;
        
        // execute child process 
        exec(command, (err, stdout, stderr) => {
            if(!err){
                if(!stderr && stdout){
                    user.sendChat(stdout, "(Child Process)")
                }
                //else console.log(stderr);
            }
            //else console.log(err);
        });
    }

    // loop over each user, functionally 
    forEachUser(cb){
        for(let pin in this._users){
            cb(this._users[pin], pin);
        }
    }

    // setup http routing
    createRoutes(){
        this._app.get("/", (req, res) => res.sendFile("index.html"));
    }

    // start the server
    init(){
        let port = parseInt(process.env.PORT) || 8080;
        this._webServer.listen(port, () => {
            console.log(`Server listening on port ${port}.`);
        });
    }
}

// main method
if(require.main === module){
    new Server();
}
import React from "react";
import { Container } from "reactstrap";
import { CommandsMenu } from "./CommandsMenu";
import { InfoModal } from "./InfoModal";
import Client from "../Client";
import "./App.css";

export class App extends React.Component{
    constructor(props){
        super(props);

        // refs 
        this.outputRef = React.createRef();
        this.inputRef = React.createRef();
    }

    // when the component mounts...
    componentDidMount(){
        // client handlers
        // (these should be removed on unmount... but app won't unmount)
        Client.on("connected", () => this.updateChat("Connected to server."));
        Client.on("close", () => this.updateChat("Lost connection."));
        Client.on("pin", () => this.updateChat(`PIN = ${Client.pin}`));
        Client.on("chat", evt => this.updateChat(evt.text, evt.from));

        // immediately connect to the server
        this.updateChat("Connecting...");
        Client.connect();
    }

    // updates the chat output element 
    updateChat(text, from){
        // the actual <textarea>
        let elem = this.outputRef.current;
        // format chat string 
        let chat = from ? `${from}: ${text}` : text;

        // update the element
        if(!elem.value){
            // empty - just paste text
            elem.value = chat;
        }
        else{
            // not empty - append text to bottom
            elem.value = `${elem.value}\n${chat}`;
            
            // scroll to bottom
            elem.scrollTop = elem.scrollHeight;
        }
    }

    // handle keyboard input
    onInput(evt){
        // get text in the <input>
        let text = this.inputRef.current.value;

        // if there is text and the key pressed is enter...
        if(text && evt.keyCode === 13){
            // send the chat request
            Client.sendChat(text);

            // clear the <input>
            this.inputRef.current.value = "";
        }
    }

    // renders the app
    render(){
        return (
            <div>
                <br/>
                <header>
                    <h1 className="text-center">Electron Chat</h1>
                </header>
                <br/>
                <Container>
                    <div className="chat">
                        <textarea ref={this.outputRef} readOnly/>
                        <br/>
                        <input
                            ref={this.inputRef}
                            type="text"
                            onKeyUp={this.onInput.bind(this)}
                        />
                    </div>
                    <div>
                        <br/>
                        <CommandsMenu/>
                    </div>
                </Container>
                <InfoModal/>
            </div>
        );
    }
}
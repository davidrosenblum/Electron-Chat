import { EventEmitter } from "events";

// triggers modals 
class ModalDispatcher extends EventEmitter{
    // trigger info modal
    modal(header, body, footer){
        this.emit("modal", {header, body, footer});
    }
}

// export singleton
export default new ModalDispatcher();
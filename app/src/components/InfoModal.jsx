import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import ModalDispatcher from "../dispatchers/ModalDispatcher";

export class InfoModal extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen: false,  // visible?
            header: null,   // header text
            body:   null,   // body text
            footer: null    // footer text
        };
    }

    // when the modal mounts...
    componentDidMount(){
        // listen for modal events and update 
        ModalDispatcher.on("modal", evt => {
            let {header=null, body=null, footer=null} = evt;
            this.setState({header, body, footer, isOpen: true});
        });
    }

    // toggles the visibility of the modal
    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }

    render(){
        return (
            <Modal isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
                <ModalHeader toggle={this.toggle.bind(this)}>
                    {this.state.header}
                </ModalHeader>
                <ModalBody>
                    {this.state.body}
                </ModalBody>
                <ModalFooter>
                    {this.state.footer}
                </ModalFooter>
            </Modal>
        )
    }
}
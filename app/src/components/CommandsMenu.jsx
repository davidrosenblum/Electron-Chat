import React from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown } from "reactstrap";
import Client from "../Client";
import ModalDispatcher from "../dispatchers/ModalDispatcher";

export class CommandsMenu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            isOpen:     false,  // visible?
            pending:    true    // loading request?
        };
    }

    // when the menu mounts...
    componentDidMount(){
        // listen for all users response
        Client.on("all-users", evt => {
            // show modal
            let {userPins=[]} = evt;
            ModalDispatcher.modal(`Online Users (${userPins.length})`, userPins.join(", "));
        });
    }

    // toggles the visibility
    toggle(){
        this.setState({isOpen: !this.state.isOpen});
    }

    // sends the request for all online users
    findAllUsers(){
        this.lockUI();
        Client.getAllUsers();
    }

    // locks/unlocks UI buttons
    lockUI(lock=true){
        this.setState({pending: lock});
    }

    render(){
        return (
            <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
            <DropdownToggle caret>
                Commands
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem header>Requests</DropdownItem>
                <DropdownItem divider/>
                <DropdownItem onClick={this.findAllUsers.bind(this)}>Find All Users</DropdownItem>
            </DropdownMenu>
            </ButtonDropdown>
        );
    }
}
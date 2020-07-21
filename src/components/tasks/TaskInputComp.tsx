import React, { EventHandler } from 'react';
import { appStrings } from "../../loc/strings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { ListActions } from "../../modules/list";

import "./style.scss"

interface InputProps {
    saveInput(taskName: string, action: ListActions): void;
    submitErr(msg: string): void;
}

interface InputState {
    taskName: string;
    err: boolean;
}

export class TaskInputComp extends React.Component<InputProps, InputState>{
    constructor(props: InputProps) {
        super(props);
        this.state = { taskName: "", err: false };
    }

    render = () => {
        return (
            <div className="taskInput">
                <FontAwesomeIcon icon={faChevronDown} className="corpColor2" />
                <input
                    type="text"
                    placeholder={appStrings.taskInput} 
                    value={this.state.taskName} 
                    onChange={this.inputUpdate} 
                    //onSubmit={this.saveInput}
                    onKeyDown={this.saveInput} 
                    className={this.state.err? "errorColor errorFont":""}></input>
            </div>
        );
    }

    /** checks for valid values */
    private inputUpdate = (event: any) => {
        let validValues = /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/;
        if (validValues.test(event.target.value) || event.target.value ==="") {
            this.setState({ taskName: event.target.value, err: false });
            this.props.submitErr("");
        }
        else {
            this.setState({  taskName: event.target.value, err: true });
            this.props.submitErr("Please only use alphanumeric values");
        }

    }

    /** sends the input value to parent */
    private saveInput = (event:any) => {
        if (this.state.taskName && !this.state.err && event.keyCode === 13) {
            this.props.saveInput(this.state.taskName, ListActions.add);
            this.setState({ taskName: "" });
        }
    }
}

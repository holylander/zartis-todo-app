import React, { useState } from 'react';
import { appStrings } from "../../loc/strings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { ListActions } from "../../modules/list";

import "./style.scss"

interface InputProps {
    saveInput(taskName: string, action: ListActions): void;
    submitErr(msg: string): void;
    disable: boolean;
}

interface InputState {
    taskName: string;
    err: boolean;
}

export function TaskInputComp(props: InputProps) {

    const [taskFormStatus, setTaskFormStatus] = useState<InputState>({ taskName: "", err: false });  // You could also do a more granular definition of the state so isolated state updates were easier ( for instance, only updating the taskname )
    

    /** checks for valid values */
    const inputUpdate = (event: any) => {
        let validValues = /^(?:[A-Za-z]+)(?:[A-Za-z0-9 _]*)$/;
        if (validValues.test(event.target.value) || event.target.value === "") {
            setTaskFormStatus({ taskName: event.target.value, err: false });
            props.submitErr("");
        }
        else {
            setTaskFormStatus({ taskName: event.target.value, err: true });
            props.submitErr("Please only use alphanumeric values");
        }

    }

    /** sends the input value to parent */
    const saveInput = (event: any) => {
        if (taskFormStatus.taskName && !taskFormStatus.err && event.keyCode === 13) {
            props.saveInput(taskFormStatus.taskName, ListActions.add);
            setTaskFormStatus({ taskName: "", err: taskFormStatus.err });
        }
    }


    return (
        <div className={`taskInput ${props.disable? "disabled":""}`}>
            <FontAwesomeIcon icon={faChevronDown} className="corpColor2" />
            <input
                type="text"
                placeholder={appStrings.taskInput}
                value={taskFormStatus.taskName}
                onChange={inputUpdate}
                onSubmit={saveInput}
                onKeyDown={saveInput}
                className={ `${taskFormStatus.err ? "errorColor errorFont" : ""} ` } 
                disabled= {props.disable}/>
        </div>
    );
}



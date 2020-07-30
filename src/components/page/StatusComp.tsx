import React from 'react';
import { ListStatus, ListStatusDetails } from '../../modules/list';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from '@fortawesome/free-solid-svg-icons'



export function StatusComp({ listStatus }: { listStatus: ListStatusDetails }) {
    //TODO: change icon based on status
    return listStatus.status !== ListStatus.ok ?
        <div className="err errorColor">
            <FontAwesomeIcon icon={faExclamation} className="errorColor" />
            <span className="errorColor" >{listStatus.msg}</span>
        </div> :
        <div className="err transitionHide"></div>;

}
import React, { useState } from 'react';

import { ListStatusDetails, ListStatus } from './../modules/list';

export function useTodoListStatus() {
    let status: ListStatusDetails = { msg: "", status: ListStatus.ok }

    const [todoListStatus, setTodoListStatus] = useState(status);

    return todoListStatus;
}


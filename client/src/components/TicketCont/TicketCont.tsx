import React, { useState } from 'react';
import { Ticket } from '../../api'




interface TicketCont {
    title: string;
    content: string;
    userEmail: string;
    creationTime: number;
    onPinChange: any;
    ticketObj: Ticket;
    mode: string;
    pinnedTickets: Ticket[];
}

export const TicketCont = (props: TicketCont) => {
    let [toggle, setToggle] = useState(false);
    const [isShowMoreOn, setIsShowMoreOn] = useState(false)
    toggle = (props.pinnedTickets.indexOf(props.ticketObj) !== -1);
    let modeTitle = props.mode + ' title';
    let showMode = isShowMoreOn? 'showMore' : 'showLess'
    let modeContent = props.mode + ' content ' + showMode;
    let modeMeta = props.mode + ' meta-data';
    return (
        <div className={props.mode}>
            <h5 className={modeTitle}>{props.title}</h5>
            <p className={modeContent}>{props.content}</p>
            <p onClick={() => { setIsShowMoreOn(!isShowMoreOn)}} id='showMode'>{isShowMoreOn? 'See less' : 'See more'}</p>
            <footer className={props.mode} >
                <div className={modeMeta}>By {props.userEmail} | {new Date(props.creationTime).toLocaleString()}</div>
                <button onClick={() => { setToggle(!toggle); props.onPinChange(props.ticketObj) }} >{toggle? 'Unpin' : 'Pin'}</button>
            </footer>
        </div>
    )
}




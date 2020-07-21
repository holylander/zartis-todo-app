import React from 'react';



export function TitleComp({ title, logo }:{ title:string, logo:string }) {
    return (
        <div>
            <img src={logo} className="App-logo" alt="logo" />
            <h1> {title} </h1>
        </div>
    );

}
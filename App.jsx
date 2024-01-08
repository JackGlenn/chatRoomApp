import React, { useState } from "react";

import MessageForm from "./messageForm.jsx";
import TextInput from "./TextInput.jsx";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "test",
        };
    }

    render() {
        return (
            <main>
                <div className="messageArea">
                    <p>line</p>
                    <p>line</p>
                    <p>line</p>
                    <p>line</p>
                    <p>line</p>
                    <p>line</p>
                    <p>line</p>
                    <p>line</p>

                    {/* <p>{this.state.test}</p>
                    <MessageForm /> */}
                </div>
                <MessageForm />
            </main>
        );
    }
}

export default App;

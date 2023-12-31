import React, { useState } from 'react'

import MessageForm from './MessageForm.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: "test"
        }
    }

    render() {
        return(
            <div>
                <p>
                    { this.state.test }
                </p>
                <MessageForm />
            </div>
        );
    }
}

export default App;
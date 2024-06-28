// import { useState, useRef, useEffect } from "react";

// import MessageForm from "./MessageForm.tsx";
import { WSProvider } from "./WebSocketProvider.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { ModeToggle } from "./components/ui/mode-toggle.tsx";
// import MessageArea from "./MessageArea.tsx";
// import Message from "./Message.tsx";
import Login from "./Login.tsx";

// import TestComponent from "./TestComponent.jsx";

function App() {
    return (
        <main>
            <ThemeProvider>
                <WSProvider>
                    <div className="topBar">
                        <div className="modeToggle">
                            <ModeToggle />
                        </div>
                    </div>
                    <Login />
                    {/* <div className="messageArea" ref={messageAreaRef}>
                {list}
                <div ref={messageAreaBottomRef} />
            </div>
            <MessageForm dataTransfer={dataTransfer}/> */}
                </WSProvider>
            </ThemeProvider>
        </main>
    );
}

export default App;

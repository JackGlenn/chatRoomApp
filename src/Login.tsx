import { useState } from "react";
import { Button } from "@/components/ui/button";

import MessageArea from "./MessageArea";

export default function Login() {
    const [loggedIn, setLoggedIn] = useState<boolean>(true);

    const Checker = () => {
        if (loggedIn) {
            return <MessageArea />;
        }
        return (
            <Button
                onClick={() => {
                    setLoggedIn(true);
                }}
            >
                Login
            </Button>
        );
    };
    return <Checker />;
}

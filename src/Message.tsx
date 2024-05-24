
type MessageProp = {
    message: string;
}

export default function Message(props: MessageProp) {
    return(
        <div className="message">
            <p>{props.message}</p>
        </div>
    );
}
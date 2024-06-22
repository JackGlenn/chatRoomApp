import { cn } from "@/lib/utils"

type MessageProp = {
    message: string;
}

export default function Message(props: MessageProp) {
    return(
        <div className={cn("pl-20 relative")}>
            <img src="/res/default-pfp.jpg" className={cn("rounded-[50%] max-w-10 absolute left-5")}/>
            <h1 className={cn("mb-2")}>UserName</h1>
            <p className={cn("rounded-lg w-max max-w-full px-3 py-2 text-sm bg-primary text-primary-foregroun whitespace-pre-line text-wrap")}>{props.message}</p>
        </div>
    );
}
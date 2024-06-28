import { cn } from "@/lib/utils";

type MessageProp = {
    message: string;
    username: string;
};

export default function Message({ message, username }: MessageProp) {
    return (
        <div className={cn("pl-20 relative")}>
            <img
                src="/res/default-pfp.jpg"
                className={cn(
                    "rounded-[50%] max-w-10 absolute left-5 aspect-square"
                )}
            />
            <h1 className={cn("mb-2")}>{username}</h1>
            <p
                className={cn(
                    "rounded-lg w-max max-w-full px-3 py-2 text-sm bg-primary text-primary-foregroun whitespace-pre-line text-wrap"
                )}
            >
                {message}
            </p>
        </div>
    );
}

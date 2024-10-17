
interface CountdownDisplayProps {
    secondsLeft: number;
    text: string;
}

export default function CountdownDisplay({ secondsLeft, text }: CountdownDisplayProps) {
    function getFormattedTime() {
        const minutes: number = Math.floor(secondsLeft / 60);
        const seconds: number = secondsLeft % 60;

        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }

    return (
        <>
            {secondsLeft > 0 && (
                <div className="mb-8 space-x-1 flex justify-center">
                    <span className="text-neutral-500 text-center">
                        {text} {getFormattedTime()}
                    </span>
                </div>
            )}
        </>
    );
}

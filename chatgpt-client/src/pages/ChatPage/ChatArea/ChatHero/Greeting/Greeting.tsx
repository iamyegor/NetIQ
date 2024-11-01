import useMediaQueries from "@/hooks/other/useMediaQueries";
import DotGreetingAnimation from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_ui/DotGreetingAnimation";
import TypewriterGreetingAnimation from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_ui/TypewriteGreetingAnimation";

export default function Greeting({ greeting }: { greeting: string }) {
    const { isSmScreen } = useMediaQueries();

    return isSmScreen ? (
        <DotGreetingAnimation greeting={greeting} />
    ) : (
        <TypewriterGreetingAnimation greeting={greeting} />
    );
}

import { useAppContext } from "@/context/AppContext";
import Greeting from "@/pages/ChatPage/ChatArea/components/ChatHero/components/Greeting/Greeting";
import useChatHeroTranslationts from "@/pages/ChatPage/ChatArea/components/ChatHero/hooks/useChatHeroTranslationts";
import { useMediaQuery } from "react-responsive";

export default function ChatHero({ hello }: { hello: string }) {
    const isMdScreen = useMediaQuery({ minWidth: 768 });
    const { setInputMessage, inputAreaHeight } = useAppContext();
    const t = useChatHeroTranslationts();

    function useSuggestedPrompt(prompt: string) {
        setInputMessage(prompt);
    }

    return (
        <main className="flex-1 flex justify-center items-center">
            <div
                className={`w-full max-w-[850px] flex items-center justify-center h-full`}
                style={{ paddingBottom: isMdScreen ? 0 : inputAreaHeight - 30 }}
            >
                <div className="flex flex-col items-center">
                    {/* <div className="">
                        <img
                            src={netIqLogo}
                            alt="Logo"
                            className="h-32 object-cover hover:opacity-70 cursor-pointer active:scale-95 transition"
                        />
                    </div> */}
                    <h1 className="text-white text-[60px] leading-[1.1]">NetIQ</h1>
                    <div className="mb-6">
                        <Greeting greeting={hello} />
                    </div>
                    <p className="text-white mb-6 text-base xs:text-lg">{t.tryPrompts}</p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 text-neutral-300">
                        {t.suggestedPrompts.map((prompt) => (
                            <button
                                key={prompt.label}
                                onClick={() => useSuggestedPrompt(prompt.prompt)}
                                className="bg-secondary hover:bg-neutral-950 border text-[13px] border-neutral-700 py-3 px-4 rounded-full flex items-center justify-start gap-x-3"
                            >
                                {prompt.icon}
                                <p>{prompt.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

import { useAppContext } from "@/context/AppContext";
import useMediaQueries from "@/hooks/useMediaQueries";
import Greeting from "@/pages/ChatPage/ChatArea/components/ChatHero/components/Greeting/Greeting";
import useChatHeroTranslationts from "@/pages/ChatPage/ChatArea/components/ChatHero/hooks/useChatHeroTranslationts";

export default function ChatHero({ hello }: { hello: string }) {
    const { isMdScreen, isSmScreen } = useMediaQueries();
    const { setInputMessage, inputAreaHeight } = useAppContext();
    const t = useChatHeroTranslationts();

    function useSuggestedPrompt(prompt: string) {
        setInputMessage(prompt);
    }

    return (
        <main className="flex-1 flex justify-center items-center">
            <div
                className={`w-full max-w-[850px] flex items-center justify-center h-full`}
                style={{
                    paddingBottom: !isSmScreen
                        ? inputAreaHeight
                        : !isMdScreen
                          ? inputAreaHeight - 30
                          : 0,
                }}
            >
                <div className="flex flex-col items-center">
                    
                    <div className="mb-4">
                        <Greeting greeting={hello} />
                    </div>
                    <p className="text-white mb-6 text-base">{t.tryPrompts}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 text-neutral-300">
                        {t.suggestedPrompts.map((prompt) => (
                            <button
                                key={prompt.label}
                                onClick={() => useSuggestedPrompt(prompt.prompt)}
                                className="bg-secondary hover:bg-neutral-950 border text-[13px] border-neutral-700 py-3 px-4 rounded-full flex items-center justify-start gap-x-3"
                            >
                                <div className="hidden xs:block">{prompt.icon}</div>
                                <p>{prompt.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}

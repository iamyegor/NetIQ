import detectLanguage from "@/pages/ChatPage/ChatArea/ChatHero/Greeting/_utils/detectLanguage";
import { motion } from "framer-motion";

function createTypewriterAnimation(index: number, isEnglish = true) {
    return {
        initial: {
            opacity: 0,
            y: 20,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
        transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
            duration: 0.5,
            delay: index * (isEnglish ? 0.15 : 0.25),
        },
    };
}

export default function TypewriterGreetingAnimation({ greeting }: { greeting: string }) {
    const language = detectLanguage();
    const words = greeting.split(" ");

    return (
        <div className="p-4">
            <div className="flex flex-wrap gap-2 text-center justify-center leading-[1.1] tracking-tight">
                {words.map((word, index) => (
                    <motion.span
                        key={`${word}-${index}`}
                        {...createTypewriterAnimation(index, language === "en")}
                        className="text-[38px] xs:text-[45px] sm:text-[39px] leading-[1.1] font-semibold text-neutral-100"
                    >
                        {word}
                    </motion.span>
                ))}
            </div>
        </div>
    );
}

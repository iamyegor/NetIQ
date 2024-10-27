import { ReactNode, useEffect, useState } from "react";

function Word({ children }: { children: ReactNode }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <span
            className={`transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        >
            {children}{" "}
        </span>
    );
}

export default Word;

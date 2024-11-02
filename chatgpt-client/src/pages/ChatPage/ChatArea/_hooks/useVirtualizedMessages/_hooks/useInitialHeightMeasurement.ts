import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function useInitialHeightMeasurement({
    clearMessageHeights,
}: {
    clearMessageHeights: () => void;
}) {
    const { chatId } = useParams();
    const [initialMeasurementComplete, setInitialMeasurementComplete] = useState(false);
    const prevChatIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (chatId != prevChatIdRef.current) {
            clearMessageHeights();
            setInitialMeasurementComplete(false);
        }

        prevChatIdRef.current = chatId ?? null;
    }, [chatId]);

    function completeMeasurement() {
        setInitialMeasurementComplete(true);
    }

    return { initialMeasurementComplete, completeMeasurement };
}

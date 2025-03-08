import { keyframes } from "@emotion/react";
import { Reveal, RevealProps } from "react-awesome-reveal";

type SlideDirection = "up" | "down" | "left" | "right";

const customSlideAnimation = (distance: number, direction: SlideDirection) => keyframes`
    from {
        opacity: 0;
        transform: translate3d(
            ${
                direction === "left"
                    ? `${distance}px`
                    : direction === "right"
                      ? `-${distance}px`
                      : "0"
            },
            ${direction === "up" ? `${distance}px` : direction === "down" ? `-${distance}px` : "0"},
            0
        );
    }

    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
`;

interface CustomSlideProps extends Omit<RevealProps, "keyframes"> {
    distance?: number;
    direction?: SlideDirection;
}

export default function SubtleSlide({
    children,
    distance = 100,
    direction = "down",
    duration = 400,
    triggerOnce = true,
    ...props
}: CustomSlideProps) {
    return (
        <Reveal
            keyframes={customSlideAnimation(distance, direction)}
            duration={duration}
            triggerOnce={triggerOnce}
            {...props}
        >
            {children}
        </Reveal>
    );
}

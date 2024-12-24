import Subscription from "@/types/chat/Subscription";
import { FunctionComponent, SVGProps } from "react";

export default interface Model {
    id: string;
    name: string;
    description: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    subscriptionAccess: Subscription[];
}

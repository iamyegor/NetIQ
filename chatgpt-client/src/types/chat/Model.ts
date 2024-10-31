import { FunctionComponent, SVGProps } from "react";
import SubscriptionStatus from "@/types/chat/SubscriptionStatus.ts";

export default interface Model {
    id: string;
    name: string;
    description: string;
    icon: FunctionComponent<SVGProps<SVGSVGElement>>;
    subscriptionAccess: SubscriptionStatus[];
}

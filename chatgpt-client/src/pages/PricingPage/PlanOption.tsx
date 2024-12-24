import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import usePricingTranslation from "./hooks/usePricingTranslation";
import usePricingStore from "@/pages/PricingPage/hooks/usePricingStore";
import { cn } from "@/lib/utils";

type PlanOptionProps = {
    title: string;
    price: number;
    features: string[];
    onUpgrade: (priceId: string) => void;
    isLoading: boolean;
    priceId?: string;
    t: ReturnType<typeof usePricingTranslation>;
};

export default function PlanOption({
    title,
    price,
    features,
    onUpgrade,
    isLoading,
    priceId,
    t,
}: PlanOptionProps) {
    const { currentPriceId } = usePricingStore();

    console.log({ currentPriceId });

    return (
        <div className="bg-neutral-700 rounded-xl p-8 text-sm xs:text-base flex flex-col justify-between h-[440px] md:h-[500px]">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-3">
                        {title === t.plus && (
                            <Sparkles className="w-6 h-6 flex-shrink-0 text-green-600" />
                        )}
                        <h3 className="text-2xl font-bold">{title}</h3>
                    </div>
                    <span className="text-neutral-400">
                        {price}
                        {t.perMonth}
                    </span>
                </div>
                <ul className="space-y-4">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Button
                onClick={() => onUpgrade(priceId!)}
                disabled={title === t.free || currentPriceId === priceId}
                className="w-full !mt-8 !p-6"
            >
                {isLoading ? (
                    <l-ring-2 color="#424242" size={25} stroke={4} />
                ) : currentPriceId === priceId ? (
                    t.currentPlan
                ) : !priceId ? (
                    t.free
                ) : (
                    t.upgrade
                )}
            </Button>
        </div>
    );
}

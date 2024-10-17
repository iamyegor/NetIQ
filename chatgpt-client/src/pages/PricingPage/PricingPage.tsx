import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, TriangleAlert, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import usePricingTranslation from "./hooks/usePricingTranslation";

type PlanOptionProps = {
    title: string;
    price: number;
    features: string[];
    onUpgrade: () => void;
    isLoading: boolean;
    t: ReturnType<typeof usePricingTranslation>;
};

function PlanOption({ title, price, features, onUpgrade, isLoading, t }: PlanOptionProps) {
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
                onClick={onUpgrade}
                className={`w-full !mt-8 !p-6 ${title === t.free && "!bg-transparent !text-neutral-400 border border-neutral-500 cursor-default"}`}
            >
                {title === t.plus ? (
                    isLoading ? (
                        <l-ring-2 color="#424242" size={25} stroke={4} />
                    ) : (
                        <span>{t.upgradeToPremium}</span>
                    )
                ) : (
                    t.currentPlan
                )}
            </Button>
        </div>
    );
}

export default function PricingPage() {
    const [showPaymentError, setShowPaymentError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const t = usePricingTranslation();

    const freePlanFeatures: string[] = [
        t.writingAssistance,
        t.accessToGPT4oMini,
        t.accessToCopyRecreate,
    ];

    const plusPlanFeatures: string[] = [
        t.writingAssistance,
        t.accessToCopyRecreate,
        t.accessToGPT4oMini,
        t.accessToGPT4o,
        t.fiveTimesMoreMessages,
    ];

    const handleSubmit = async () => {
        setIsLoading(true);
        setShowPaymentError(false);

        await new Promise((resolve) => setTimeout(resolve, 400));

        setIsLoading(false);
        setShowPaymentError(true);
    };

    return (
        <div className="min-h-full bg-neutral-800 flex items-center justify-center py-16 px-2.5 xs:px-5 sm:px-10">
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-30">
                <Alert
                    className={`max-w-[600px] min-w-[300px] xs:min-w-[380px] sm:min-w-[450px] text-sm space-x-3 gap-y-3 flex-col relative !bg-red-700 !border-red-500 ${showPaymentError ? "!opacity-100" : "!opacity-0"} transition-opacity`}
                >
                    <TriangleAlert className="h-6 w-6 !text-white mt-1" />
                    <AlertTitle className="text-base">{t.paymentError}</AlertTitle>
                    <AlertDescription>
                        <span>{t.regionUnavailable}</span>
                        <Button
                            className="absolute top-1 right-1 !w-7 !h-7 !p-1 !rounded-lg hover:!bg-neutral-200/10"
                            variant="ghost"
                        >
                            <X
                                className="w-full h-full text-white"
                                onClick={() => setShowPaymentError(false)}
                            />
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
            <Link
                to="/"
                className="absolute top-5 right-3 xs:right-5 hover:bg-neutral-200/10 rounded-lg p-0.5 transition"
            >
                <X className="w-7 h-7 text-white" />
            </Link>
            <div className="w-full max-w-5xl space-y-10 text-white">
                <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-center text-white">
                    {t.upgrade}
                </h1>
                <div className="flex flex-col-reverse md:flex-row gap-6">
                    <PlanOption
                        isLoading={false}
                        title={t.free}
                        price={0}
                        features={freePlanFeatures}
                        onUpgrade={() => {}}
                        t={t}
                    />
                    <PlanOption
                        isLoading={isLoading}
                        title={t.plus}
                        price={1500}
                        features={plusPlanFeatures}
                        onUpgrade={() => handleSubmit()}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
}

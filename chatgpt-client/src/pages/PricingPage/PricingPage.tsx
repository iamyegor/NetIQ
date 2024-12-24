import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import plans from "@/pages/PricingPage/data/plans";
import PlanOption from "@/pages/PricingPage/PlanOption";
import makeCreateCheckoutSessionRequest from "@/pages/PricingPage/utils/makeCreateCheckoutSessionRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import usePricingTranslation from "./hooks/usePricingTranslation";
import fetchCurrentPlan from "@/pages/PricingPage/utils/fetchCurrentPlan";
import usePricingStore from "@/pages/PricingPage/hooks/usePricingStore";

export default function PricingPage() {
    const [showPaymentError, setShowPaymentError] = useState(false);
    const t = usePricingTranslation();

    const { setCurrentPriceId } = usePricingStore();

    const { data: loadedPriceId } = useQuery({
        queryKey: ["current-plan"],
        queryFn: () => fetchCurrentPlan(),
    });

    useEffect(() => {
        setCurrentPriceId(loadedPriceId);
    }, [loadedPriceId]);

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

    const createCheckoutMutation = useMutation({
        mutationFn: async (params: { priceId: string }) => {
            return await makeCreateCheckoutSessionRequest(params.priceId);
        },
        onSuccess: (redirectUrl) => {
            window.open(redirectUrl, "_blank");
        },
        onError: () => {
            setShowPaymentError(true);
        },
    });

    return (
        <div className="min-h-full bg-neutral-800 flex items-center justify-center py-16 px-2.5 xs:px-5 sm:px-10">
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-30">
                <Alert
                    className={`max-w-[600px] min-w-[300px] xs:min-w-[380px] sm:min-w-[450px] text-sm space-x-3 gap-y-3 flex-col relative !bg-red-700 !border-red-500 ${showPaymentError ? "!opacity-100" : "!opacity-0"} transition-opacity`}
                >
                    <TriangleAlert className="h-6 w-6 !text-white mt-1" />
                    <Button size="sm-icon" className="absolute -right-2 -top-2 !p-1 !rounded-lg">
                        <X className="w-full h-full" onClick={() => setShowPaymentError(false)} />
                    </Button>
                    <AlertTitle className="text-base">{t.paymentError}</AlertTitle>
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
                        isLoading={createCheckoutMutation.isPending}
                        title={t.plus}
                        price={t.price}
                        priceId={plans.find((plan) => plan.name === "Plus")?.priceId}
                        features={plusPlanFeatures}
                        onUpgrade={(priceId) => createCheckoutMutation.mutate({ priceId })}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
}

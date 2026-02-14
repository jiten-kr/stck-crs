import PaymentSuccessPage, {
    type PaymentSuccessData,
} from "@/components/payment-success/PaymentSuccessPage";

export const dynamic = "force-dynamic";

type PaymentSuccessPageProps = {
    searchParams?: Record<string, string | string[] | undefined>;
};

const getStringParam = (
    value: string | string[] | undefined,
): string | undefined => {
    if (Array.isArray(value)) return value[0];
    return value;
};

const getNumberParam = (
    value: string | string[] | undefined,
): number | null => {
    const resolved = getStringParam(value);
    if (!resolved) return null;
    const parsed = Number(resolved);
    return Number.isFinite(parsed) ? parsed : null;
};

const buildDataFromParams = (
    searchParams?: Record<string, string | string[] | undefined>,
): PaymentSuccessData | null => {
    if (!searchParams) return null;

    const userName = getStringParam(searchParams.userName);
    const email = getStringParam(searchParams.email);
    const phone = getStringParam(searchParams.phone);
    const bookingId = getStringParam(searchParams.bookingId);
    const paymentId = getStringParam(searchParams.paymentId);
    const orderId = getStringParam(searchParams.orderId);
    const currency = getStringParam(searchParams.currency);
    const className = getStringParam(searchParams.className);
    const paymentDate = getStringParam(searchParams.paymentDate);
    const amount = getNumberParam(searchParams.amount);

    if (
        !userName ||
        !email ||
        !phone ||
        !bookingId ||
        !paymentId ||
        !orderId ||
        amount === null ||
        !currency ||
        !className ||
        !paymentDate
    ) {
        return null;
    }

    return {
        userName,
        email,
        phone,
        bookingId,
        paymentId,
        orderId,
        amount,
        currency,
        className,
        paymentDate,
    } satisfies PaymentSuccessData;
};

export default function PaymentSuccess({
    searchParams,
}: PaymentSuccessPageProps) {
    const data = buildDataFromParams(searchParams);

    return <PaymentSuccessPage data={data} />;
}


const API_LOGIN = process.env.API_LOGIN;
const API_PASSWORD = process.env.API_PASSWORD;
const GATEWAY_URL = process.env.GATEWAY_URL || "https://gateway-test.jcc.com.cy/payment";

export interface JccRegisterResponse {
    orderId?: string;
    formUrl?: string;
    errorCode?: string;
    errorMessage?: string;
}

export async function registerOrder(params: {
    amount: number; // in minor units (e.g. 1000 for 10.00)
    orderNumber: string;
    returnUrl: string;
    description?: string;
    jsonParams?: string;
}): Promise<JccRegisterResponse> {
    if (!API_LOGIN || !API_PASSWORD) {
        throw new Error("JCC API credentials not set");
    }

    const searchParams = new URLSearchParams();
    searchParams.append("userName", API_LOGIN);
    searchParams.append("password", API_PASSWORD);
    searchParams.append("amount", params.amount.toString());
    searchParams.append("orderNumber", params.orderNumber);
    searchParams.append("returnUrl", params.returnUrl);
    searchParams.append("currency", "978"); // EUR
    if (params.description) searchParams.append("description", params.description);
    if (params.jsonParams) searchParams.append("jsonParams", params.jsonParams);

    const res = await fetch(`${GATEWAY_URL}/rest/register.do`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams.toString(),
    });

    if (!res.ok) {
        throw new Error(`JCC Register Error ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

export async function getOrderStatus(orderId: string) {
    if (!API_LOGIN || !API_PASSWORD) {
        throw new Error("JCC API credentials not set");
    }

    const searchParams = new URLSearchParams();
    searchParams.append("userName", API_LOGIN);
    searchParams.append("password", API_PASSWORD);
    searchParams.append("orderId", orderId);

    const res = await fetch(`${GATEWAY_URL}/rest/getOrderStatusExtended.do`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams.toString(),
    });

    if (!res.ok) {
        throw new Error(`JCC Status Error ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

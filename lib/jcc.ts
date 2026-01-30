import crypto from 'crypto';

const JCC_MERCHANT_ID = process.env.JCC_MERCHANT_ID!; // valid merchant id
const JCC_ACQUIRER_ID = process.env.JCC_ACQUIRER_ID!;
const JCC_PASSWORD = process.env.JCC_PASSWORD!;

// JCC typically requires Version 1.0.0 signature:
// Signature = Base64(SHA1(Password + MerchantID + AcquirerID + OrderID + Amount + Currency))
// OR MD5 depending on specific gateway version.
// I will implement the most common one: Base64(SHA1(...))

export function generateJccSignature(orderId: string, amount: string, currency: string = "978") {
    // Amount must be formatted (e.g. 10.00 or 1000 depending on JCC requirement).
    // JCC typically wants padded amount? Or just string.
    // Assuming standard implementation:

    const toSign = JCC_PASSWORD + JCC_MERCHANT_ID + JCC_ACQUIRER_ID + orderId + amount + currency;

    const shasum = crypto.createHash('sha1');
    shasum.update(toSign);
    return shasum.digest('base64');
}

export function verifyJccSignature(data: any): boolean {
    // Verification logic for callback
    // Usually JCC sends a signature back signed with the password
    // Signature = Base64(SHA1(Password + MerchantID + AcquirerID + OrderID + ResponseCode + Currency))

    const { MerchantID, AcquirerID, OrderID, ResponseCode, Currency } = data;
    const signature = data.Signature;

    const toSign = JCC_PASSWORD + MerchantID + AcquirerID + OrderID + ResponseCode + Currency;

    const shasum = crypto.createHash('sha1');
    shasum.update(toSign);
    const calculated = shasum.digest('base64');

    return calculated === signature;
}

export const JCC_CONFIG = {
    merchantId: JCC_MERCHANT_ID,
    acquirerId: JCC_ACQUIRER_ID,
    purchaseUrl: process.env.JCC_PURCHASE_URL || "https://test.jccsmart.com/pay",
    responseUrl: process.env.JCC_RESPONSE_URL,
};

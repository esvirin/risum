export interface PushPressUser {
    id: string; // uuid or id
    firstName: string;
    lastName: string;
    email: string;
    membershipStatus: 'active' | 'inactive' | 'pending';
    planName: string;
    classesRemaining: number;
    lastVisit?: string;
    photoUrl?: string;
}



export interface PushPressClass {
    id: string;
    coachUuid: string;
    assistantCoachUuid: string;
    title: string;
    classTypeName: string;
    locationUuid: string | null;
    start: number;
    end: number;
}


export interface PushPressCompany {
    id: string;
    name: string;
    subdomain: string;
    address: {
        city: string;
        state: string;
        postalCode: string;
        country: {
            name: string;
            iso: string;
        };
        line1: string;
        line2: string;
    };
    defaultTimezone: string;
    phone: string;
    email: string;
    url: string;
}


/*
[{"id":"usr_049dfc79d8b616896982d2460f24915f","companyId":"client_8bdcb9db6d735d","name":{"first":"Maxim","last":"Brovko","nickname":""},"gender":null,"dob":null,"address":{"line1":"","line2":"","city":"","country":"","state":"","zip":""},"assignedToStaffId":null,"account":{"type":"primary"},"emergencyContact":{"name":"","phone":"","relationship":""},"membershipDetails":{"initialMembershipStartDate":"1970-01-01"},"email":"max@risumcyprus.eu","phone":"","role":"admin"},{"id":"usr_25e09f0ed83e62","companyId":"client_8bdcb9db6d735d","name":{"first":"Evgeny","last":"Svirin","nickname":""},"gender":null,"dob":null,"address":{"line1":"","line2":"","city":"El Campello","country":"","state":"VC","zip":"03560"},"assignedToStaffId":null,"account":{"type":"primary"},"emergencyContact":{"name":"","phone":"","relationship":""},"membershipDetails":null,"email":"esvirin@mail.com","phone":"622403610","role":"lead"},{"id":"usr_e7a3150e64cee0","companyId":"client_8bdcb9db6d735d","name":{"first":"Evgeny","last":"Svirin","nickname":""},"gender":"male","dob":null,"address":{"line1":"","line2":"","city":"","country":"","state":"","zip":""},"assignedToStaffId":"usr_049dfc79d8b616896982d2460f24915f","account":{"type":"primary"},"emergencyContact":{"name":"","phone":"","relationship":""},"membershipDetails":{"initialMembershipStartDate":"2026-02-01"},"email":"evg.svirin@gmail.com","phone":"","role":"member"}]
*/

export interface PushPressCustomer {
    id: string;
    companyId: string;
    name: {
        first: string;
        last: string;
        nickname: string;
    };
    gender: string;
    dob: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        country: string;
        state: string;
        zip: string;
    };
    assignedToStaffId: string;
    account: {
        type: string;
    };
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    membershipDetails: {
        initialMembershipStartDate: string;
    };
    email: string;
    phone: string;
    role: string;
}

const API_KEY = process.env.PUSHPRESS_API_KEY;
const API_URL = process.env.PUSHPRESS_API_URL;


export async function getCompany(): Promise<PushPressCompany | null> {
    const data = await fetchPushPress(`/company`);
    return data;
}


export async function getCustomers(companyId: string): Promise<{ data: { resultArray: PushPressCustomer[] } } | null> {
    const data = await fetchPushPress(`/customers`, { headers: { 'company-id': companyId } });
    return data;
}

async function fetchPushPress(endpoint: string, options: RequestInit = {}) {
    if (!API_KEY) throw new Error("PUSHPRESS_API_KEY is not set");

    const headers = {
        'API-KEY': API_KEY,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        throw new Error(`PushPress API Error ${res.status}: ${await res.text()}`);
    }

    return res.json();
}

export async function getPushPressMemberByEmail(email: string): Promise<PushPressUser | null> {
    try {
        const data = await fetchPushPress(`/customers?email=${encodeURIComponent(email)}`);
        console.log(data.resultArray);
        // Assuming data structure: { data: { resultArray: [...] } } or just { resultArray: [...] } based on curls
        // Correct handling for diverse API responses might be needed.
        const results = data.resultArray || data.data?.resultArray || [];

        if (!results || results.length === 0) return null;

        const customer = results[0];

        return {
            id: customer.uuid || customer.id || 'unknown',
            firstName: customer.first_name || 'Unknown',
            lastName: customer.last_name || '',
            email: customer.email,
            membershipStatus: customer.status === 'Active' ? 'active' : 'inactive',
            planName: customer.plan_name || 'Membership',
            classesRemaining: customer.classes_remaining || 0,
            photoUrl: customer.photo_url,
        };
    } catch (error) {
        console.error("getPushPressMemberByEmail error:", error);
        return null;
    }
}

export async function getUpcomingClasses(): Promise<PushPressClass[]> {
    try {
        const data = await fetchPushPress('/classes?type=active');
        const results = data.data.resultArray || [];
        return results
    } catch (error) {
        console.error("getUpcomingClasses error:", error);
        return [];
    }
}

export async function getCoachByUuid(uuid: string): Promise<any | null> {
    try {
        const data = await fetchPushPress(`/users?uuid=${encodeURIComponent(uuid)}`);
        const results = data.data.resultArray || [];
        return results[0];
    } catch (error) {
        console.error("getCoachByUuid error:", error);
        return null;
    }
}

export async function bookClass(classId: string, memberId: string): Promise<boolean> {
    // MOCK IMPLEMENTATION - API docs needed for real POST
    console.log(`[MOCK] Booking class ${classId} for member ${memberId}`);
    return true;
}

export async function cancelBooking(bookingId: string): Promise<boolean> {
    // MOCK IMPLEMENTATION
    console.log(`[MOCK] Cancelling booking ${bookingId}`);
    return true;
}

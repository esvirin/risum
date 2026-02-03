const API_KEY = process.env.PUSHPRESS_API_KEY;
const API_URL = process.env.PUSHPRESS_API_URL;


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


export async function getCompany(): Promise<PushPressCompany | null> {
    const data = await fetchPushPress(`/company`);
    return data;
}


export async function getCustomers(companyId: string): Promise<{ data: { resultArray: PushPressCustomer[] } } | null> {
    const data = await fetchPushPress(`/customers`, { headers: { 'company-id': companyId } });
    return data;
}

export async function getPushPressCustomerByEmail(email: string): Promise<PushPressCustomer | null> {
    try {
        const data = await fetchPushPress(`/customers?email=${encodeURIComponent(email)}`);


        const results = data.resultArray || data.data?.resultArray || [];

        if (!results || results.length === 0) return null;

        const customer = results[0];

        return customer;
    } catch (error) {
        console.error("getPushPressCustomerByEmail error:", error);
        return null;
    }
}

export async function getUpcomingClasses(): Promise<PushPressClass[]> {
    try {
        const data = await fetchPushPress('/classes?type=active');
        const results = data.data?.resultArray || data.resultArray || [];
        return results;
    } catch (error) {
        console.error("❌ getUpcomingClasses error:", error);
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


export async function createNewCustomer(customer: any): Promise<PushPressCustomer | null> {
    try {
        const company = await getCompany();
        if (!company) return null
        const data = await fetchPushPress(`/customers`, { headers: { 'company-id': company.id }, method: 'POST', body: JSON.stringify(customer) });
        return data;
    } catch (error) {
        console.error("createNewCustomer error:", error);
        return null;
    }
}

// ===== NEW INTERFACES FROM API =====

export interface PushPressReservation {
    id: string;
    reservedId: string; // Calendar event ID
    customerId: string | null;
    companyId: string | null;
    registrationTimestamp: number;
    status: 'waitlisted' | 'checked-in' | 'reserved' | 'canceled' | 'late-canceled';
    templateId?: string | null;
}

export interface PushPressPlan {
    id: string;
    name: string;
    companyId: string;
    recurrenceDetails: {
        type: 'session-pack' | 'recurring' | 'limited-recurring' | 'non-recurring';
        occurrences?: number;
    };
    policies: {
        allowClassCheckins: boolean;
        allowOpenGymCheckins: boolean;
        allow24HourAccess: boolean;
    };
    category: {
        name: string;
    };
}

export interface PushPressEnrollment {
    id: string;
    customerId: string;
    companyId: string;
    planId: string | null;
    billingSchedule: {
        period: 'day' | 'week' | 'month' | 'year' | 'once';
        interval: number;
    };
    status: 'active' | 'alert' | 'canceled' | 'completed' | 'paused' | 'pendactivation' | 'pendcancel';
    startDate: string | null;
    endDate: string | null;
    lastCharge: string | null;
    nextCharge: string | null;
    paidUntil: string | null;
    checkinDetails: {
        checkins: number;
        limit: number; // -1 for unlimited
    };
    entitlements: Array<{
        type: string;
        id: string;
        interval: string;
        quantity: number;
        metadata: any;
    }>;
}

// ===== RESERVATION/BOOKING FUNCTIONS =====

/**
 * Create a reservation (book a class) for a customer
 * POST /reservations - Not in docs but inferred from the Reservation schema
 * Note: The API docs show reservations but don't document the POST endpoint
 * This implementation may need adjustment based on actual API behavior
 */
export async function createReservation(classId: string, customerId: string): Promise<PushPressReservation | null> {
    try {
        // Note: Based on API patterns, POST to create reservation
        // The actual endpoint may be /classes/{id}/reserve or /reservations
        const data = await fetchPushPress(`/reservations`, {
            method: 'POST',
            body: JSON.stringify({
                reservedId: classId,
                customerId: customerId,
            }),
        });
        return data;
    } catch (error) {
        console.error("createReservation error:", error);
        return null;
    }
}

/**
 * List reservations for a specific class
 * GET /reservations?calendarItemId={id}
 */
export async function getReservationsForClass(classId: string, page: number = 1, limit: number = 10): Promise<PushPressReservation[]> {
    try {
        const data = await fetchPushPress(`/reservations?calendarItemId=${encodeURIComponent(classId)}&page=${page}&limit=${limit}`);
        return data.data?.resultArray || [];
    } catch (error) {
        console.error("getReservationsForClass error:", error);
        return [];
    }
}

/**
 * Get a specific reservation by ID
 * GET /reservations/{id}
 */
export async function getReservation(reservationId: string): Promise<PushPressReservation | null> {
    try {
        const data = await fetchPushPress(`/reservations/${encodeURIComponent(reservationId)}`);
        return data;
    } catch (error) {
        console.error("getReservation error:", error);
        return null;
    }
}

/**
 * Cancel a reservation
 * DELETE /reservations/{id} - Inferred from typical REST patterns
 * Note: May need to be PATCH with status update instead
 */
export async function cancelReservation(reservationId: string): Promise<boolean> {
    try {
        await fetchPushPress(`/reservations/${encodeURIComponent(reservationId)}`, {
            method: 'DELETE',
        });
        return true;
    } catch (error) {
        console.error("cancelReservation error:", error);
        return false;
    }
}

// ===== PLAN FUNCTIONS =====

/**
 * List all available plans
 * GET /plans - Inferred from typical REST patterns, not explicitly in docs
 */
export async function getPlans(): Promise<PushPressPlan[]> {
    try {
        const data = await fetchPushPress(`/plans`);
        return data.data?.resultArray || data.resultArray || [];
    } catch (error) {
        console.error("getPlans error:", error);
        return [];
    }
}

/**
 * Get a specific plan by ID
 * GET /plans/{id}
 */
export async function getPlan(planId: string): Promise<PushPressPlan | null> {
    try {
        const data = await fetchPushPress(`/plans/${encodeURIComponent(planId)}`);
        return data;
    } catch (error) {
        console.error("getPlan error:", error);
        return null;
    }
}

// ===== ENROLLMENT FUNCTIONS =====

/**
 * List enrollments for a customer
 * GET /enrollments?customerId={id}
 */
export async function getEnrollments(customerId?: string, status?: string, page: number = 1, limit: number = 10): Promise<PushPressEnrollment[]> {
    try {
        let url = `/enrollments?page=${page}&limit=${limit}`;
        if (customerId) url += `&customerId=${encodeURIComponent(customerId)}`;
        if (status) url += `&status=${encodeURIComponent(status)}`;

        const data = await fetchPushPress(url);
        return data.data?.resultArray || [];
    } catch (error) {
        console.error("getEnrollments error:", error);
        return [];
    }
}

/**
 * Get a specific enrollment by ID
 * GET /enrollments/{uuid}
 */
export async function getEnrollment(enrollmentId: string): Promise<PushPressEnrollment | null> {
    try {
        const data = await fetchPushPress(`/enrollments/${encodeURIComponent(enrollmentId)}`);
        return data;
    } catch (error) {
        console.error("getEnrollment error:", error);
        return null;
    }
}

/**
 * Create an enrollment (purchase a plan)
 * POST /enrollments - Inferred, not explicitly in docs
 * Note: This is a complex operation that typically requires payment processing
 * The actual implementation may require additional fields and integration with payment provider
 */
export async function createEnrollment(customerId: string, planId: string, paymentMethodId?: string): Promise<PushPressEnrollment | null> {
    try {
        const data = await fetchPushPress(`/enrollments`, {
            method: 'POST',
            body: JSON.stringify({
                customerId,
                planId,
                paymentMethodId, // May be required depending on plan
            }),
        });
        return data;
    } catch (error) {
        console.error("createEnrollment error:", error);
        return null;
    }
}

// ===== LEGACY COMPATIBILITY =====

/**
 * @deprecated Use createReservation instead
 */
export async function bookClass(classId: string, memberId: string): Promise<boolean> {
    const result = await createReservation(classId, memberId);
    return result !== null;
}

/**
 * @deprecated Use cancelReservation instead
 */
export async function cancelBooking(bookingId: string): Promise<boolean> {
    return await cancelReservation(bookingId);
}


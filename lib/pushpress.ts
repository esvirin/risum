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
    name: string;
    startTime: string; // ISO
    endTime: string;
    instructor: string;
    location: string;
    spotsTotal: number;
    spotsDetailed?: {
        reserved: number;
        checked_in: number;
    }
}

const API_KEY = process.env.PUSHPRESS_API_KEY;
const API_URL = process.env.PUSHPRESS_API_URL;

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
        // Determine internal structure. Assuming /classes endpoint returns list.
        // We might need to pass start/end dates? 
        // For now, simple GET.
        const data = await fetchPushPress('/classes?type=active');

        // Check if response is { resultArray: [...] }
        const results = data.resultArray || data.data?.resultArray || [];

        // Map to interface
        return results.map((cls: any) => ({
            id: cls.class_id || cls.id,
            name: cls.name || 'Class',
            startTime: cls.date_time || cls.start_time, // Adjust based on actual fields
            endTime: cls.end_time_time || cls.end_time,
            instructor: cls.instructor_name || 'Staff',
            location: cls.room_name || 'Main Studio',
            spotsTotal: cls.limit || 20,
        }));
    } catch (error) {
        console.error("getUpcomingClasses error:", error);
        return [];
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

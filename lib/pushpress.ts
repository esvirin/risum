export interface PushPressUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    membershipStatus: 'active' | 'inactive' | 'pending';
    planName: string;
    classesRemaining: number;
    lastVisit?: string;
}

export interface PushPressClass {
    id: string;
    name: string;
    startTime: string;
    instructor: string;
    location: string;
}

// Mock data for demonstration
const MOCK_USER: PushPressUser = {
    id: "pp_123456",
    firstName: "Ivan",
    lastName: "Ivanov",
    email: "ivan@example.com",
    membershipStatus: 'active',
    planName: "Unlimited Pilates Monthly",
    classesRemaining: 12,
    lastVisit: "2024-05-20",
};

const MOCK_CLASSES: PushPressClass[] = [
    {
        id: "cls_1",
        name: "Morning Flow",
        startTime: "2024-05-25T09:00:00Z",
        instructor: "Elena",
        location: "Studio A",
    },
    {
        id: "cls_2",
        name: "Core Strength",
        startTime: "2024-05-26T18:30:00Z",
        instructor: "Alex",
        location: "Studio B",
    },
];

export async function getPushPressUser(userId: string): Promise<PushPressUser> {
    // In a real implementation:
    // const response = await fetch(`https://api.pushpress.com/v3/members/${userId}`, {
    //   headers: { 'Authorization': `Bearer ${process.env.PUSHPRESS_API_KEY}` }
    // });
    // return response.json();

    // For now, simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_USER;
}

export async function getUpcomingClasses(): Promise<PushPressClass[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return MOCK_CLASSES;
}

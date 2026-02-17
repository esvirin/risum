import type { PushPressClass, PushPressEnrollment, PushPressPlan } from "@/lib/pushpress";

export const mockUser = {
  name: "Member",
  email: "member@fitspace.local",
};

const now = new Date();
const addHours = (h: number) => Math.floor((Date.now() + h * 3600 * 1000) / 1000);

export const mockClasses: PushPressClass[] = [
  {
    id: "class-1",
    coachUuid: "coach-1",
    assistantCoachUuid: "Alex",
    title: "Functional Strength",
    classTypeName: "strength",
    locationUuid: "loc-1",
    start: addHours(6),
    end: addHours(7),
  },
  {
    id: "class-2",
    coachUuid: "coach-2",
    assistantCoachUuid: "Mia",
    title: "HIIT Express",
    classTypeName: "cardio",
    locationUuid: "loc-1",
    start: addHours(28),
    end: addHours(29),
  },
  {
    id: "class-3",
    coachUuid: "coach-3",
    assistantCoachUuid: "Leo",
    title: "Mobility & Recovery",
    classTypeName: "recovery",
    locationUuid: "loc-1",
    start: addHours(52),
    end: addHours(53),
  },
];

export const mockPlans: PushPressPlan[] = [
  {
    id: "plan-1",
    name: "Unlimited Monthly",
    description: "Unlimited access to all classes and open gym.",
    companyId: "fitspace",
    recurrenceDetails: { type: "recurring" },
    policies: {
      allowClassCheckins: true,
      allowOpenGymCheckins: true,
      allow24HourAccess: false,
    },
    category: { name: "Memberships" },
  },
  {
    id: "plan-2",
    name: "10 Class Pack",
    description: "Flexible package for occasional training.",
    companyId: "fitspace",
    recurrenceDetails: { type: "session-pack", occurrences: 10 },
    policies: {
      allowClassCheckins: true,
      allowOpenGymCheckins: false,
      allow24HourAccess: false,
    },
    category: { name: "Class Packs" },
  },
];

export const mockEnrollments: PushPressEnrollment[] = [
  {
    id: "enroll-1",
    customerId: "member-1",
    companyId: "fitspace",
    planId: "plan-1",
    billingSchedule: { period: "month", interval: 1 },
    status: "active",
    startDate: now.toISOString(),
    endDate: null,
    lastCharge: now.toISOString(),
    nextCharge: new Date(now.getTime() + 25 * 24 * 3600 * 1000).toISOString(),
    paidUntil: null,
    checkinDetails: { checkins: 8, limit: -1 },
    entitlements: [],
  },
];

export const mockPayments = [
  {
    id: "pay-1",
    createdAt: new Date(now.getTime() - 5 * 24 * 3600 * 1000).toISOString(),
    description: "Monthly membership",
    amount: 89,
    status: "COMPLETED",
  },
  {
    id: "pay-2",
    createdAt: new Date(now.getTime() - 15 * 24 * 3600 * 1000).toISOString(),
    description: "Drop-in class",
    amount: 15,
    status: "COMPLETED",
  },
];

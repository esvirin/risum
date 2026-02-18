const DEFAULT_BOOKING_URL = "https://n123456.alteg.io";
const DEFAULT_CABINET_URL = "https://n123456.alteg.io/login";
const DEFAULT_SCHEDULE_WIDGET_URL = "https://n123456.alteg.io/widget/calendar";
const DEFAULT_TRAINERS_WIDGET_URL = "https://n123456.alteg.io/widget/staff";
const DEFAULT_IOS_APP_URL = "https://apps.apple.com/app/altegio/id1477754250";
const DEFAULT_ANDROID_APP_URL = "https://play.google.com/store/apps/details?id=com.yclients.mobile";

export const altegioLinks = {
  booking: process.env.NEXT_PUBLIC_ALTEGIO_BOOKING_URL || DEFAULT_BOOKING_URL,
  cabinet: process.env.NEXT_PUBLIC_ALTEGIO_CABINET_URL || DEFAULT_CABINET_URL,
  scheduleWidget:
    process.env.NEXT_PUBLIC_ALTEGIO_SCHEDULE_WIDGET_URL || DEFAULT_SCHEDULE_WIDGET_URL,
  trainersWidget:
    process.env.NEXT_PUBLIC_ALTEGIO_TRAINERS_WIDGET_URL || DEFAULT_TRAINERS_WIDGET_URL,
  iosApp: process.env.NEXT_PUBLIC_ALTEGIO_IOS_APP_URL || DEFAULT_IOS_APP_URL,
  androidApp:
    process.env.NEXT_PUBLIC_ALTEGIO_ANDROID_APP_URL || DEFAULT_ANDROID_APP_URL,
};

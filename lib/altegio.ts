const DEFAULT_BOOKING_URL = "https://n1416681.alteg.io/";
const DEFAULT_CABINET_URL = "https://n1416681.alteg.io/login";
const DEFAULT_TRAINERS_WIDGET_URL = "https://n1416681.alteg.io/widget/staff";
const DEFAULT_IOS_APP_URL = "";
const DEFAULT_ANDROID_APP_URL = "";

export const altegioLinks = {
  booking: process.env.NEXT_PUBLIC_ALTEGIO_BOOKING_URL || DEFAULT_BOOKING_URL,
  cabinet: process.env.NEXT_PUBLIC_ALTEGIO_CABINET_URL || DEFAULT_CABINET_URL,
  trainersWidget:
    process.env.NEXT_PUBLIC_ALTEGIO_TRAINERS_WIDGET_URL || DEFAULT_TRAINERS_WIDGET_URL,
  iosApp: process.env.NEXT_PUBLIC_ALTEGIO_IOS_APP_URL || DEFAULT_IOS_APP_URL,
  androidApp:
    process.env.NEXT_PUBLIC_ALTEGIO_ANDROID_APP_URL || DEFAULT_ANDROID_APP_URL,
};

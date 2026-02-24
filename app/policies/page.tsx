import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";

export default function PoliciesPage() {
  return (
    <div className="bg-[#f7f4ef] text-zinc-900 min-h-screen">
      <PublicNav />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="text-4xl sm:text-5xl tracking-tight">Studio Policies</h1>
        <p className="mt-4 text-zinc-600">
          To help our studio run efficiently, please note our studio policies. Thank you in advance.
        </p>

        <ol className="mt-8 space-y-4 border border-zinc-200 bg-white p-5 sm:p-6 text-sm text-zinc-700">
          <li>1. Each session lasts 55 minutes. Please arrive a few minutes earlier for your session to ensure a healthy warm up.</li>
          <li>2. To avoid interrupting group progress, you will not be able to join the class if you are more than 10 minutes late after it starts.</li>
          <li>3. 24 hours notice is required. Cancellations/rescheduling must be made 24 hours in advance or that session is charged. Monday morning appointments must be canceled/rescheduled before Saturday noon to avoid charge (illness reasons excluded).</li>
          <li>4. Classes with less than 2 people will be rescheduled.</li>
          <li>5. All sessions and classes are paid in advance.</li>
          <li>6. All packages have an expiration date and are non-refundable. Please consider this before you purchase packages.</li>
          <li>7. Cell phones: to keep a peaceful environment with minimum distractions, please turn off cellular phones and be respectful of others.</li>
          <li>8. Comfortable workout clothing is recommended. Kindly remove street shoes before entering the workout area. Socks are required for lessons.</li>
          <li>9. Cleanliness: after each class/session, wipe down the reformer, replace the springs, and return straps to the shoulder posts.</li>
        </ol>
      </main>

      <SiteFooter />
    </div>
  );
}

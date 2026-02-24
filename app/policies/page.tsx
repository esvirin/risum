"use client";

import { PublicNav } from "@/components/PublicNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useI18n } from "@/components/LanguageProvider";

export default function PoliciesPage() {
  const { locale } = useI18n();

  const copy =
    locale === "ru"
      ? {
          title: "Правила студии",
          lead: "Чтобы студия работала эффективно, пожалуйста, ознакомьтесь с правилами. Спасибо!",
          items: [
            "1. Длительность одной сессии — 55 минут. Пожалуйста, приходите за несколько минут до начала, чтобы спокойно подготовиться.",
            "2. Чтобы не прерывать ход группового занятия, присоединиться нельзя, если опоздание более 10 минут от начала класса.",
            "3. Для отмены/переноса требуется уведомление за 24 часа, иначе занятие списывается. Занятия в понедельник утром нужно отменять/переносить до полудня субботы (кроме случаев болезни).",
            "4. Занятия, где записано меньше 2 человек, переносятся.",
            "5. Все занятия оплачиваются заранее.",
            "6. Все пакеты имеют срок действия и не подлежат возврату. Учитывайте это перед покупкой.",
            "7. Пожалуйста, отключайте мобильные телефоны, чтобы сохранять спокойную атмосферу и не отвлекать других.",
            "8. Рекомендуется удобная спортивная одежда. Перед входом в тренировочную зону снимайте уличную обувь. Носки обязательны.",
            "9. После каждого занятия протирайте реформер, возвращайте пружины в исходное положение и ремни на плечевые стойки.",
          ],
        }
      : {
          title: "Studio Policies",
          lead: "To help our studio run efficiently, please note our studio policies. Thank you in advance.",
          items: [
            "1. Each session lasts 55 minutes. Please arrive a few minutes earlier for your session to ensure a healthy warm up.",
            "2. To avoid interrupting group progress, you will not be able to join the class if you are more than 10 minutes late after it starts.",
            "3. 24 hours notice is required. Cancellations/rescheduling must be made 24 hours in advance or that session is charged. Monday morning appointments must be canceled/rescheduled before Saturday noon to avoid charge (illness reasons excluded).",
            "4. Classes with less than 2 people will be rescheduled.",
            "5. All sessions and classes are paid in advance.",
            "6. All packages have an expiration date and are non-refundable. Please consider this before you purchase packages.",
            "7. Cell phones: to keep a peaceful environment with minimum distractions, please turn off cellular phones and be respectful of others.",
            "8. Comfortable workout clothing is recommended. Kindly remove street shoes before entering the workout area. Socks are required for lessons.",
            "9. Cleanliness: after each class/session, wipe down the reformer, replace the springs, and return straps to the shoulder posts.",
          ],
        };

  return (
    <div className="bg-[#f7f4ef] text-zinc-900 min-h-screen">
      <PublicNav />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <h1 className="text-4xl sm:text-5xl tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-zinc-600">{copy.lead}</p>

        <ol className="mt-8 space-y-4 border border-zinc-200 bg-white p-5 sm:p-6 text-sm text-zinc-700">
          {copy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </main>

      <SiteFooter />
    </div>
  );
}

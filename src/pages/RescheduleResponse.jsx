import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";
import "./RescheduleResponse.css";

const copy = {
  en: { title: "Appointment time change", intro: "The practitioner has proposed a new time for your appointment.", accept: "Accept new time", reject: "Decline proposal", loading: "Processing…", accepted: "Your appointment has been moved to the proposed time.", rejected: "The proposal was declined. Your original appointment remains unchanged.", expired: "This proposal has expired. Please contact the practitioner.", unavailable: "This time is no longer available. Please contact the practitioner.", cancelled: "This proposal is no longer active. Please contact the practitioner.", done: "This proposal has already been processed.", error: "We could not process your response. Please contact the practitioner.", invalid: "This link is missing or invalid.", confirmReject: "Decline the proposed time? Your original appointment will remain unchanged." },
  fr: { title: "Modification du rendez-vous", intro: "La praticienne vous propose un nouvel horaire pour votre rendez-vous.", accept: "Accepter le nouvel horaire", reject: "Refuser la proposition", loading: "Traitement…", accepted: "Votre rendez-vous a été déplacé au nouvel horaire proposé.", rejected: "La proposition a été refusée. Votre rendez-vous initial reste inchangé.", expired: "Cette proposition a expiré. Veuillez contacter la praticienne.", unavailable: "Cet horaire n’est plus disponible. Veuillez contacter la praticienne.", cancelled: "Cette proposition n’est plus active. Veuillez contacter la praticienne.", done: "Cette proposition a déjà été traitée.", error: "Impossible de traiter votre réponse. Veuillez contacter la praticienne.", invalid: "Ce lien est manquant ou invalide.", confirmReject: "Refuser ce nouvel horaire ? Votre rendez-vous initial restera inchangé." },
  uk: { title: "Зміна часу запису", intro: "Майстриня пропонує новий час вашого запису.", accept: "Погодитися на новий час", reject: "Відхилити пропозицію", loading: "Обробка…", accepted: "Ваш запис перенесено на запропонований час.", rejected: "Пропозицію відхилено. Початковий запис не змінено.", expired: "Термін пропозиції минув. Зв’яжіться з майстринею.", unavailable: "Цей час уже недоступний. Зв’яжіться з майстринею.", cancelled: "Ця пропозиція більше не активна. Зв’яжіться з майстринею.", done: "Цю пропозицію вже оброблено.", error: "Не вдалося обробити відповідь. Зв’яжіться з майстринею.", invalid: "Посилання відсутнє або недійсне.", confirmReject: "Відхилити запропонований час? Початковий запис залишиться без змін." },
  ru: { title: "Изменение времени записи", intro: "Мастер предлагает новое время вашего визита.", accept: "Принять новое время", reject: "Отклонить предложение", loading: "Обработка…", accepted: "Ваша запись перенесена на предложенное время.", rejected: "Предложение отклонено. Исходная запись не изменена.", expired: "Срок предложения истёк. Свяжитесь с мастером.", unavailable: "Это время больше недоступно. Свяжитесь с мастером.", cancelled: "Это предложение больше не активно. Свяжитесь с мастером.", done: "Это предложение уже обработано.", error: "Не удалось обработать ответ. Свяжитесь с мастером.", invalid: "Ссылка отсутствует или недействительна.", confirmReject: "Отклонить предложенное время? Исходная запись останется без изменений." }
};

export default function RescheduleResponse() {
  const { language } = useLanguage();
  const words = copy[language] || copy.en;
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const initialError = useMemo(() => !/^[0-9a-f]{64}$/i.test(token), [token]);

  async function respond(action) {
    if (action === "reject" && !window.confirm(words.confirmReject)) return;
    setBusy(true);
    setError("");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("respond-to-reschedule", {
        body: { token, action },
      });
      if (invokeError || !data?.success) throw invokeError || new Error(data?.error || words.error);
      setResult(data.status || "");
    } catch (err) {
      console.error("Reschedule response failed:", err);
      setError(words.error);
    } finally {
      setBusy(false);
    }
  }

  const resultText = {
    accepted: words.accepted,
    rejected: words.rejected,
    expired: words.expired,
    unavailable: words.unavailable,
    cancelled: words.cancelled,
  }[result] || (result ? words.done : "");

  return (
    <main className="reschedule-response">
      <section className="reschedule-response__card">
        <span className="reschedule-response__brand">ELNARA<span>.</span></span>
        <h1>{words.title}</h1>
        <p>{words.intro}</p>
        {initialError ? <p className="reschedule-response__error" role="alert">{words.invalid}</p> : null}
        {error ? <p className="reschedule-response__error" role="alert">{error}</p> : null}
        {resultText ? <p className="reschedule-response__result" role="status">{resultText}</p> : null}
        {!initialError && !result && !error ? (
          <div className="reschedule-response__actions">
            <button type="button" onClick={() => respond("accept")} disabled={busy}>{busy ? words.loading : words.accept}</button>
            <button type="button" className="is-secondary" onClick={() => respond("reject")} disabled={busy}>{words.reject}</button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

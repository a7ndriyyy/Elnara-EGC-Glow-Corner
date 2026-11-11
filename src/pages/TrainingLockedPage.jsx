import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { FiLock } from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import "./TrainingLockedPage.css";

/**
 * "Training — in development" placeholder (TZ step 8), shown on /about while
 * `features.trainingEnabled` is false. The full training page is untouched.
 * The notify form goes through the same EmailJS template as the site's
 * consultation forms (fields: name, email, phone, message).
 */
export default function TrainingLockedPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [state, setState] = useState({ status: "idle", message: "" });

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (state.status === "invalid" || state.status === "error") setState({ status: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) return setState({ status: "invalid", message: t("training.needName") });
    if (!form.email.trim() && !form.phone.trim()) {
      return setState({ status: "invalid", message: t("training.needContact") });
    }

    setState({ status: "sending", message: "" });
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: t("training.emailMessage"),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setState({ status: "sent", message: t("training.success") });
      setForm({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error("Training notify form failed:", error);
      setState({ status: "error", message: t("training.error") });
    }
  };

  return (
    <section className="training-locked" aria-labelledby="training-locked-title">
      <div className="training-locked__inner">
        <div className="training-locked__lock" aria-hidden="true">
          <FiLock />
        </div>

        <p className="training-locked__eyebrow">{t("training.eyebrow")}</p>
        <h1 className="training-locked__title" id="training-locked-title">{t("training.title")}</h1>
        <span className="training-locked__divider" aria-hidden="true"><span /></span>
        <p className="training-locked__text">{t("training.text")}</p>

        {state.status === "sent" ? (
          <p className="training-locked__status training-locked__status--ok" role="status">
            {state.message}
          </p>
        ) : (
          <form className="training-locked__form" onSubmit={handleSubmit} noValidate>
            <label>
              <span>{t("training.name")}</span>
              <input type="text" autoComplete="name" value={form.name} onChange={update("name")} required />
            </label>
            <div className="training-locked__row">
              <label>
                <span>{t("training.email")}</span>
                <input type="email" autoComplete="email" value={form.email} onChange={update("email")} />
              </label>
              <label>
                <span>{t("training.phone")}</span>
                <input type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} />
              </label>
            </div>
            <p className="training-locked__hint">{t("training.contactHint")}</p>

            {state.message && (
              <p className="training-locked__status training-locked__status--error" role="alert">
                {state.message}
              </p>
            )}

            <button type="submit" className="btn btn--primary" disabled={state.status === "sending"}>
              {state.status === "sending" ? t("training.sending") : t("training.submit")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

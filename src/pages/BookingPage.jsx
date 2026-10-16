
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../i18n/LanguageContext";
import "./BookingPage.css";

const categoryLabels = {
  Макіяж: "booking.categoryMakeup",
  Обличчя: "booking.categoryFace",
  "Тіло та масаж": "booking.categoryBody",
  "Брови та вії": "booking.categoryBrows",
};


const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function getMonthLabel(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((mondayOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - mondayOffset + 1;
    const date = new Date(year, month, dayNumber);

    return {
      date,
      key: formatDate(date),
      inCurrentMonth: date.getMonth() === month,
    };
  });
}

export default function BookingPage() {
  const { t, language } = useLanguage();
  const locale = { en: "en-GB", fr: "fr-FR", uk: "uk-UA", ru: "ru-RU" }[language] || "en-GB";
  const weekdayLabels = t("booking.weekdays");
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const paymentState = searchParams.get("payment") || "";
  const checkoutSessionId = searchParams.get("session_id") || "";

  const [allServices, setAllServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [serviceId, setServiceId] = useState(initialService);

  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const maxDate = useMemo(() => addDays(today, 60), [today]);

  const [date, setDate] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  const selectedService = allServices.find(
    (service) => service.id === serviceId
  );

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      setServicesLoading(true);
      setServicesError("");

      const { data, error } = await supabase
        .from("services")
        .select("id, category, name, price_eur, duration_minutes")
        .eq("is_active", true)
        .order("name");

      if (cancelled) return;

      if (error) {
        console.error("Failed to load services:", error);
        setServicesError(t("booking.servicesError"));
        setServicesLoading(false);
        return;
      }

      setAllServices(
        (data || []).map((service) => ({
          id: service.id,
          category: service.category,
          name: service.name,
          price:
            service.price_eur == null
              ? "Price to be confirmed"
              : `${Number(service.price_eur).toLocaleString("en-GB")} €`,
          duration:
            service.duration_minutes % 60 === 0
              ? `${service.duration_minutes / 60} hr`
              : service.duration_minutes > 60
                ? `${Math.floor(service.duration_minutes / 60)} hr ${service.duration_minutes % 60} min`
                : `${service.duration_minutes} min`,
          durationMinutes: service.duration_minutes,
        }))
      );

      setServicesLoading(false);
    }

    loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (servicesLoading || !serviceId) return;

    const serviceExists = allServices.some(
      (service) => service.id === serviceId
    );

    if (!serviceExists) {
      setServiceId("");
    }
  }, [allServices, servicesLoading, serviceId]);

  useEffect(() => {
    let cancelled = false;

    setAvailableSlots([]);
    setSelectedSlot("");
    setSlotsError("");

    if (!serviceId || !date || servicesLoading || servicesError) {
      setSlotsLoading(false);
      return;
    }

    async function loadAvailableSlots() {
      setSlotsLoading(true);

      const { data, error } = await supabase.rpc("get_available_slots", {
        p_service_id: serviceId,
        p_date: date,
      });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load available slots:", error);
        setSlotsError(t("booking.refreshError"));
        setAvailableSlots([]);
      } else {
        // Hide intervals temporarily held while a customer considers a
        // rescheduling proposal. Fail closed if the hold query fails.
        const { data: holds, error: holdsError } = await supabase.rpc(
          "get_active_reschedule_holds",
          { p_date: date }
        );

        if (holdsError) {
          console.error("Failed to load rescheduling holds:", holdsError);
          setSlotsError(t("booking.refreshError"));
          setAvailableSlots([]);
        } else {
          const activeHolds = holds || [];
          const durationMs = (selectedService?.durationMinutes || 0) * 60_000;
          setAvailableSlots(
            (data || []).filter((slot) => {
              const slotStart = new Date(slot.starts_at).getTime();
              const slotEnd = slotStart + durationMs;
              return !activeHolds.some((hold) =>
                slotStart < new Date(hold.ends_at).getTime() &&
                slotEnd > new Date(hold.starts_at).getTime()
              );
            })
          );
        }
      }

      setSlotsLoading(false);
    }

    loadAvailableSlots();

    return () => {
      cancelled = true;
    };
  }, [serviceId, date, servicesLoading, servicesError, selectedService?.durationMinutes]);

  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth]
  );

  const firstAllowedMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const lastAllowedMonth = new Date(
    maxDate.getFullYear(),
    maxDate.getMonth(),
    1
  );

  const canGoPrevious = visibleMonth > firstAllowedMonth;
  const canGoNext = visibleMonth < lastAllowedMonth;

  function clearStatus() {
    setStatus("idle");
    setSubmitMessage("");
  }

  function selectDate(day) {
    if (day < formatDate(today) || day > formatDate(maxDate)) {
      return;
    }

    setDate(day);
    setSelectedSlot("");
    clearStatus();
  }

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    let attempts = 0;

    if (paymentState === "cancelled") {
      setStatus("paymentCancelled");
      setSubmitMessage(t("booking.paymentCancelled"));
      return () => {};
    }

    if (paymentState !== "processing") return () => {};

    if (!checkoutSessionId) {
      setStatus("failed");
      setSubmitMessage(t("booking.paymentFailed"));
      return () => {};
    }

    setStatus("paymentPending");
    setSubmitMessage(t("booking.paymentPending"));

    async function checkPayment() {
      attempts += 1;
      const { data, error } = await supabase.functions.invoke(
        "booking-payment-status",
        { body: { session_id: checkoutSessionId } }
      );

      if (cancelled) return;

      if (!error && data?.status === "paid") {
        setStatus("success");
        setSubmitMessage(t("booking.paymentSuccess"));
        return;
      }

      if (!error && (data?.status === "not_paid" || data?.status === "unknown") && attempts >= 40) {
        setStatus("paymentUnverified");
        setSubmitMessage(t("booking.paymentFailed"));
        return;
      }

      if (attempts >= 40) {
        setStatus("paymentUnverified");
        setSubmitMessage(t("booking.paymentFailed"));
        return;
      }

      timeoutId = setTimeout(checkPayment, 2500);
    }

    checkPayment();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [paymentState, checkoutSessionId, t]);

  async function handleSubmit(event) {
    event.preventDefault();
    clearStatus();

    if (
      !selectedService ||
      !date ||
      !selectedSlot ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setSubmitMessage(t("booking.required"));
      setStatus("error");
      return;
    }

    if (!turnstileSiteKey) {
      setSubmitMessage(t("booking.security"));
      setStatus("failed");
      return;
    }

    if (!turnstileToken) {
      setStatus("captcha");
      return;
    }

    setStatus("submitting");

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            service_id: serviceId,
            starts_at: selectedSlot,
            customer_name: name.trim(),
            customer_phone: phone.trim(),
            customer_email: email.trim(),
            turnstile_token: turnstileToken,
          },
        }
      );

      if (error || !data?.checkout_url) {
        console.error("Checkout session request failed:", error || data);
        let responseData = data;

        if (error?.context && typeof error.context.clone === "function") {
          try {
            responseData = await error.context.clone().json();
          } catch {
            // Keep the generic message when the response is not JSON.
          }
        }

        const message = responseData?.error || data?.error || t("booking.failed");
        setSubmitMessage(message);
        setStatus("failed");
        return;
      }

      // Only the server-created Stripe Checkout URL is allowed to redirect the client.
      const checkoutUrl = new URL(data.checkout_url);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
        throw new Error("Unexpected checkout URL.");
      }
      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      console.error("Unexpected checkout error:", error);
      setSubmitMessage(t("booking.connection"));
      setStatus("failed");
    } finally {
      setTurnstileToken("");
      setTurnstileKey((key) => key + 1);
    }
  }

  return (
    <main className="booking-page">
      <section className="booking-card">
        <p className="booking-eyebrow">{t("booking.eyebrow")}</p>
        <h1>{t("booking.title")}</h1>

        <p className="booking-intro">
          {t("booking.intro")}
        </p>

        <div className="booking-notice" role="note">
          <strong>{t("booking.request")}</strong>
          <p>
            {t("booking.notice")}
          </p>
        </div>

        <p className="booking-payment-notice" role="note">{t("booking.depositNotice")}</p>

        <form onSubmit={handleSubmit}>
          {servicesLoading && (
            <p role="status">{t("booking.loadingServices")}</p>
          )}

          {servicesError && (
            <p className="booking-error" role="alert">
              {servicesError}
            </p>
          )}

          <label htmlFor="booking-service">{t("booking.service")}</label>
          <select
            id="booking-service"
            value={serviceId}
            onChange={(event) => {
              setServiceId(event.target.value);
              setSelectedSlot("");
              setAvailableSlots([]);
              clearStatus();
            }}
            required
            disabled={servicesLoading || Boolean(servicesError)}
          >
            <option value="">{t("booking.chooseService")}</option>

            {Object.entries(categoryLabels).map(([category, label]) => {
              const categoryServices = allServices.filter(
                (service) => service.category === category
              );

              if (categoryServices.length === 0) return null;

              return (
                <optgroup key={category} label={t(label)}>
                  {categoryServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} — {service.price}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          {selectedService && (
            <div className="booking-service-summary">
              <p>
                <strong>{t("booking.service")}:</strong> {selectedService.name}
              </p>
              <p>
                <strong>{t("booking.price")}:</strong> {selectedService.price}
              </p>
              <p>
                <strong>{t("booking.duration")}:</strong> {selectedService.duration}
              </p>
            </div>
          )}

          <fieldset className="booking-calendar">
            <legend>{t("booking.date")}</legend>

            <div className="booking-calendar-header">
              <button
                type="button"
                className="booking-month-nav"
                aria-label={t("booking.previousMonth")}
                disabled={!canGoPrevious}
                onClick={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                ‹
              </button>

              <h2>{getMonthLabel(visibleMonth, locale)}</h2>

              <button
                type="button"
                className="booking-month-nav"
                aria-label={t("booking.nextMonth")}
                disabled={!canGoNext}
                onClick={() =>
                  setVisibleMonth(
                    new Date(
                      visibleMonth.getFullYear(),
                      visibleMonth.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                ›
              </button>
            </div>

            <div
              className="booking-calendar-grid"
              role="group"
              aria-label={t("booking.chooseDate")}
            >
              {weekdayLabels.map((weekday) => (
                <span key={weekday} className="booking-weekday">
                  {weekday}
                </span>
              ))}

              {calendarDays.map((day) => {
                const dayKey = day.key;
                const isAllowed =
                  dayKey >= formatDate(today) &&
                  dayKey <= formatDate(maxDate);
                const isSelected = date === dayKey;
                const isToday = dayKey === formatDate(today);

                return (
                  <button
                    key={dayKey}
                    type="button"
                    className={[
                      "booking-calendar-day",
                      !day.inCurrentMonth && "outside-month",
                      !isAllowed && "unavailable",
                      isSelected && "selected",
                      isToday && "today",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    disabled={!day.inCurrentMonth || !isAllowed}
                    aria-pressed={isSelected}
                    aria-label={day.date.toLocaleDateString(locale, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    onClick={() => selectDate(dayKey)}
                  >
                    {day.date.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="booking-calendar-legend">
              <span>
                <i className="legend-dot selected-dot" /> {t("booking.selected")}
              </span>
              <span>
                <i className="legend-dot unavailable-dot" /> {t("booking.unavailable")}
              </span>
            </div>

            {date && (
              <p className="booking-selected-date">
                {t("booking.selectedDate")}{" "}
                <strong>
                  {parseDate(date).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </p>
            )}

            <p className="booking-hint">
              {t("booking.dateHint")}
            </p>
          </fieldset>

          <fieldset className="booking-times">
            <legend>{t("booking.times")}</legend>

            {!serviceId || !date ? (
              <p className="booking-hint">
                {t("booking.chooseServiceDate")}
              </p>
            ) : slotsLoading ? (
              <p role="status">{t("booking.loadingTimes")}</p>
            ) : slotsError ? (
              <p className="booking-error" role="alert">
                {slotsError}
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="booking-hint">
                {t("booking.noTimes")}
              </p>
            ) : (
              <div className="booking-time-slot-grid">
                {availableSlots.map((slot) => {
                  const time = new Intl.DateTimeFormat(locale, {
                    timeZone: "Europe/Paris",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }).format(new Date(slot.starts_at));

                  return (
                    <button
                      key={slot.starts_at}
                      type="button"
                      className={[
                        "booking-time-slot",
                        selectedSlot === slot.starts_at && "selected",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={selectedSlot === slot.starts_at}
                      onClick={() => {
                        setSelectedSlot(slot.starts_at);
                        clearStatus();
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

          <label htmlFor="booking-name">{t("booking.name")}</label>
          <input
            id="booking-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearStatus();
            }}
            required
          />

          <label htmlFor="booking-phone">{t("booking.phone")}</label>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              clearStatus();
            }}
            required
          />

          <label htmlFor="booking-email">{t("booking.email")}</label>
          <input
            id="booking-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearStatus();
            }}
            required
          />

          <div className="booking-turnstile">
            {turnstileSiteKey ? (
              <Turnstile
                key={turnstileKey}
                siteKey={turnstileSiteKey}
                onSuccess={(token) => {
                  setTurnstileToken(token);
                  if (status === "captcha") setStatus("idle");
                }}
                onExpire={() => setTurnstileToken("")}
                onError={() => {
                  setTurnstileToken("");
                  setSubmitMessage(
                    t("booking.security")
                  );
                }}
              />
            ) : (
              <p className="booking-error" role="alert">
                {t("booking.security")}
              </p>
            )}
          </div>

          {status === "error" && (
            <p className="booking-error" role="alert">
              {t("booking.required")}
            </p>
          )}

          {status === "captcha" && (
            <p className="booking-error" role="alert">
              {t("booking.captcha")}
            </p>
          )}

          {status === "failed" && (
            <p className="booking-error" role="alert">
              {submitMessage}
            </p>
          )}

          {(status === "success" || status === "paymentPending" || status === "paymentCancelled" || status === "paymentUnverified") && (
            <p role="status" className={status === "paymentCancelled" || status === "paymentUnverified" ? "booking-error" : undefined}>
              {submitMessage}
            </p>
          )}

          <button
            className="booking-submit"
            type="submit"
            disabled={
              servicesLoading ||
              Boolean(servicesError) ||
              allServices.length === 0 ||
              slotsLoading ||
              Boolean(slotsError) ||
              status === "submitting" ||
              status === "paymentPending" ||
              status === "paymentUnverified" ||
              status === "success" ||
              !turnstileSiteKey
            }
          >
            {status === "submitting"
              ? t("booking.paymentSub")
              : status === "paymentPending"
                ? t("booking.paymentPending")
                : status === "success"
                  ? t("booking.paymentSuccess")
                  : t("booking.payDeposit")}
          </button>
        </form>
      </section>
    </main>
  );
}


import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { supabase } from "../lib/supabase";
import "./BookingPage.css";

const categoryLabels = {
  Макіяж: "Макіяж",
  Обличчя: "Догляд за обличчям",
  "Тіло та масаж": "Тіло та масаж",
  "Брови та вії": "Брови та вії",
};

const weekdayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

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

function getMonthLabel(date) {
  return new Intl.DateTimeFormat("en-GB", {
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
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "";

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
        setServicesError("Unable to load services. Please try again later.");
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
        setSlotsError("Unable to load available times. Please try again.");
        setAvailableSlots([]);
      } else {
        setAvailableSlots(data || []);
      }

      setSlotsLoading(false);
    }

    loadAvailableSlots();

    return () => {
      cancelled = true;
    };
  }, [serviceId, date, servicesLoading, servicesError]);

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
      setStatus("error");
      return;
    }

    if (!turnstileSiteKey) {
      setSubmitMessage(
        "Security verification is not configured. Please try again later."
      );
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
        "create-appointment",
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

      if (error || !data?.success) {
        console.error("Appointment request failed:", error || data);

        setSubmitMessage(
          data?.error ||
            "We could not submit your request. Please try again."
        );
        setStatus("failed");
        return;
      }

      setStatus("success");
      setSubmitMessage(
        "Your appointment request has been received. Please wait for confirmation."
      );

      setTurnstileToken("");
      setTurnstileKey((key) => key + 1);
    } catch (error) {
      console.error("Unexpected booking error:", error);

      setSubmitMessage(
        "A connection error occurred. Please try again."
      );
      setStatus("failed");
    } finally {
      setTurnstileToken("");
      setTurnstileKey((key) => key + 1);
    }
  }

  return (
    <main className="booking-page">
      <section className="booking-card">
        <p className="booking-eyebrow">ELNARA BEAUTY</p>
        <h1>Book an appointment</h1>

        <p className="booking-intro">
          Choose a service and your preferred date, then leave your contact
          details. We will confirm availability before your appointment.
        </p>

        <div className="booking-notice" role="note">
          <strong>Appointment requests</strong>
          <p>
            Available times are checked against the booking calendar.
            Your appointment is not confirmed until you receive confirmation.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {servicesLoading && (
            <p role="status">Loading services...</p>
          )}

          {servicesError && (
            <p className="booking-error" role="alert">
              {servicesError}
            </p>
          )}

          <label htmlFor="booking-service">Service</label>
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
            <option value="">Choose a service</option>

            {Object.entries(categoryLabels).map(([category, label]) => {
              const categoryServices = allServices.filter(
                (service) => service.category === category
              );

              if (categoryServices.length === 0) return null;

              return (
                <optgroup key={category} label={label}>
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
                <strong>Service:</strong> {selectedService.name}
              </p>
              <p>
                <strong>Price:</strong> {selectedService.price}
              </p>
              <p>
                <strong>Duration:</strong> {selectedService.duration}
              </p>
            </div>
          )}

          <fieldset className="booking-calendar">
            <legend>Preferred date</legend>

            <div className="booking-calendar-header">
              <button
                type="button"
                className="booking-month-nav"
                aria-label="Previous month"
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

              <h2>{getMonthLabel(visibleMonth)}</h2>

              <button
                type="button"
                className="booking-month-nav"
                aria-label="Next month"
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
              aria-label="Choose a date"
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
                    aria-label={day.date.toLocaleDateString("en-GB", {
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
                <i className="legend-dot selected-dot" /> Selected
              </span>
              <span>
                <i className="legend-dot unavailable-dot" /> Unavailable
              </span>
            </div>

            {date && (
              <p className="booking-selected-date">
                Selected date:{" "}
                <strong>
                  {parseDate(date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </p>
            )}

            <p className="booking-hint">
              Choose a date to check actual available times. Selecting a date
              does not reserve an appointment.
            </p>
          </fieldset>

          <fieldset className="booking-times">
            <legend>Available times</legend>

            {!serviceId || !date ? (
              <p className="booking-hint">
                Choose a service and date to see available times.
              </p>
            ) : slotsLoading ? (
              <p role="status">Loading available times...</p>
            ) : slotsError ? (
              <p className="booking-error" role="alert">
                {slotsError}
              </p>
            ) : availableSlots.length === 0 ? (
              <p className="booking-hint">
                No available times for this date. Please choose another date.
              </p>
            ) : (
              <div className="booking-time-grid">
                {availableSlots.map((slot) => {
                  const time = new Intl.DateTimeFormat("en-GB", {
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

          <label htmlFor="booking-name">Full name</label>
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

          <label htmlFor="booking-phone">Phone</label>
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

          <label htmlFor="booking-email">Email</label>
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
                    "Security verification failed. Please reload the verification and try again."
                  );
                }}
              />
            ) : (
              <p className="booking-error" role="alert">
                Security verification is not configured.
              </p>
            )}
          </div>

          {status === "error" && (
            <p className="booking-error" role="alert">
              Please complete all required fields and select an available time.
            </p>
          )}

          {status === "captcha" && (
            <p className="booking-error" role="alert">
              Please complete the security verification before submitting.
            </p>
          )}

          {status === "failed" && (
            <p className="booking-error" role="alert">
              {submitMessage}
            </p>
          )}

          {status === "success" && (
            <p role="status">
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
              status === "success" ||
              !turnstileSiteKey
            }
          >
            {status === "submitting"
              ? "Submitting request..."
              : status === "success"
                ? "Request submitted"
                : "Request appointment"}
          </button>
        </form>
      </section>
    </main>
  );
}

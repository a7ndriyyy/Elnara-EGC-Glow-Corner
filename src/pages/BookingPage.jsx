import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./BookingPage.css";

const allServices = [
  { id: "bridal-makeup", category: "Макіяж", name: "Весільний макіяж", price: "250 €", duration: "2 год" },
  { id: "evening-makeup", category: "Макіяж", name: "Вечірній макіяж", price: "180 €", duration: "1.5 год" },
  { id: "day-makeup", category: "Макіяж", name: "Денний макіяж", price: "120 €", duration: "1 год" },
  { id: "smokey-eyes", category: "Макіяж", name: "Smokey Eyes", price: "160 €", duration: "1.5 год" },
  { id: "mens-makeup", category: "Макіяж", name: "Чоловічий макіяж", price: "100 €", duration: "1 год" },
  { id: "trial-makeup", category: "Макіяж", name: "Пробний макіяж", price: "80 €", duration: "1 год" },
  { id: "ultrasonic-cleaning", category: "Обличчя", name: "Ультразвукове чищення", price: "90 €", duration: "1 год" },
  { id: "combined-cleaning", category: "Обличчя", name: "Комбіноване чищення", price: "120 €", duration: "1.5 год" },
  { id: "face-rf", category: "Обличчя", name: "RF-ліфтинг обличчя", price: "150 €", duration: "1 год" },
  { id: "microcurrent", category: "Обличчя", name: "Мікротокова терапія", price: "110 €", duration: "1 год" },
  { id: "face-massage", category: "Обличчя", name: "Масаж обличчя", price: "70 €", duration: "45 хв" },
  { id: "biorevitalization", category: "Обличчя", name: "Біоревіталізація", price: "350 €", duration: "1 год" },
  { id: "face-neck-massage", category: "Обличчя", name: "Масаж обличчя та шиї", price: "60 €", duration: "40 хв" },
  { id: "lpg-full-body", category: "Тіло та масаж", name: "LPG масаж всього тіла", price: "200 €", duration: "1 год" },
  { id: "lpg-abdomen-thighs", category: "Тіло та масаж", name: "LPG масаж живота та стегон", price: "150 €", duration: "45 хв" },
  { id: "cryolipolysis", category: "Тіло та масаж", name: "Кріоліполіз (1 зона)", price: "300 €", duration: "1 год" },
  { id: "anti-cellulite-wrap", category: "Тіло та масаж", name: "Антицелюлітне обгортання", price: "80 €", duration: "1 год" },
  { id: "body-rf", category: "Тіло та масаж", name: "RF-ліфтинг тіла", price: "180 €", duration: "1 год" },
  { id: "back-massage", category: "Тіло та масаж", name: "Класичний масаж спини", price: "70 €", duration: "45 хв" },
  { id: "full-body-massage", category: "Тіло та масаж", name: "Загальний масаж тіла", price: "120 €", duration: "1.5 год" },
  { id: "anti-cellulite-massage", category: "Тіло та масаж", name: "Антицелюлітний масаж", price: "90 €", duration: "1 год" },
  { id: "lymphatic-massage", category: "Тіло та масаж", name: "Лімфодренажний масаж", price: "100 €", duration: "1 год" },
  { id: "brow-shaping", category: "Брови та вії", name: "Корекція брів", price: "25 €", duration: "20 хв" },
  { id: "brow-coloring", category: "Брови та вії", name: "Фарбування брів", price: "20 €", duration: "15 хв" },
  { id: "brow-shaping-coloring", category: "Брови та вії", name: "Корекція + фарбування", price: "40 €", duration: "35 хв" },
  { id: "brow-lamination", category: "Брови та вії", name: "Ламінування брів", price: "60 €", duration: "1 год" },
  { id: "lash-coloring", category: "Брови та вії", name: "Фарбування вій", price: "15 €", duration: "15 хв" },
  { id: "lash-lamination", category: "Брови та вії", name: "Ламінування вій", price: "Ціну уточнити", duration: "1 год" },
];

const categoryLabels = {
  Макіяж: "Макіяж",
  Обличчя: "Догляд за обличчям",
  "Тіло та масаж": "Тіло та масаж",
  "Брови та вії": "Брови та вії",
};

const weekdayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

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

  const [serviceId, setServiceId] = useState(
    allServices.some((service) => service.id === initialService)
      ? initialService
      : ""
  );

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

  const selectedService = allServices.find(
    (service) => service.id === serviceId
  );

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
  }

  function selectDate(day) {
    if (day < formatDate(today) || day > formatDate(maxDate)) {
      return;
    }

    setDate(day);
    clearStatus();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !selectedService ||
      !date ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setStatus("error");
      return;
    }

    setStatus("unavailable");
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
          <strong>Online booking is being prepared</strong>
          <p>
            Live availability is not connected yet. Selecting a date does not
            reserve an appointment. Your request cannot be submitted online
            until availability is connected.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="booking-service">Service</label>
          <select
            id="booking-service"
            value={serviceId}
            onChange={(event) => {
              setServiceId(event.target.value);
              clearStatus();
            }}
            required
          >
            <option value="">Choose a service</option>
            {Object.entries(categoryLabels).map(([category, label]) => {
              const categoryServices = allServices.filter(
                (service) => service.category === category
              );

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
              <p><strong>Service:</strong> {selectedService.name}</p>
              <p><strong>Price:</strong> {selectedService.price}</p>
              <p><strong>Duration:</strong> {selectedService.duration}</p>
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

            <div className="booking-calendar-grid" role="group" aria-label="Choose a date">
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
                    ].filter(Boolean).join(" ")}
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
              <span><i className="legend-dot selected-dot" /> Selected</span>
              <span><i className="legend-dot unavailable-dot" /> Unavailable</span>
            </div>

            {date && (
              <p className="booking-selected-date">
                Selected date: <strong>{parseDate(date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</strong>
              </p>
            )}

            <p className="booking-hint">
              Calendar dates are selectable for planning only. Actual
              availability will appear after the live calendar is connected.
            </p>
          </fieldset>

          <fieldset className="booking-times">
            <legend>Available times</legend>
            <p className="booking-hint">
              Time slots are hidden until real availability can be checked.
            </p>
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

          {status === "error" && (
            <p className="booking-error" role="alert">
              Please complete all required fields.
            </p>
          )}

          {status === "unavailable" && (
            <p className="booking-error" role="alert">
              Online requests are not available yet because live availability
              has not been connected. Please contact ELNARA directly to arrange
              an appointment.
            </p>
          )}

          <button className="booking-submit" type="submit">
            Check availability
          </button>
        </form>
      </section>
    </main>
  );
}

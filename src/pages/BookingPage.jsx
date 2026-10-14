import React, { useState } from "react";
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
  "Макіяж": "Макіяж",
  "Обличчя": "Догляд за обличчям",
  "Тіло та масаж": "Тіло та масаж",
  "Брови та вії": "Брови та вії",
};

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();

  const initialService = searchParams.get("service") || "";

  const [serviceId, setServiceId] = useState(
    allServices.some((service) => service.id === initialService)
      ? initialService
      : ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const selectedService = allServices.find(
    (service) => service.id === serviceId
  );

  const today = formatDate(new Date());

  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() + 60);
  const maxDate = formatDate(dateLimit);

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !selectedService ||
      !date ||
      !time ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      setStatus("error");
      return;
    }

    // Prototype only: no request is sent and no slot is reserved.
    setStatus("demo");
  }

  function clearStatus() {
    setStatus("idle");
  }

  return (
    <main className="booking-page">
      <section className="booking-card">
        <p className="booking-eyebrow">ELNARA BEAUTY</p>

        <h1>Book an appointment</h1>

        <p className="booking-intro">
          Choose a service, your preferred date and time, and leave your
          contact details.
        </p>

        <div className="booking-notice" role="note">
          <strong>Demo version</strong>
          <p>
            The available times are examples and are not synchronized
            with the real calendar. This form does not create a booking.
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

              if (categoryServices.length === 0) {
                return null;
              }

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

          <label htmlFor="booking-date">Preferred date</label>

          <input
            id="booking-date"
            type="date"
            min={today}
            max={maxDate}
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setTime("");
              clearStatus();
            }}
            required
          />

          <fieldset className="booking-times">
            <legend>Preferred time</legend>

            <div className="booking-time-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={
                    time === slot
                      ? "booking-time selected"
                      : "booking-time"
                  }
                  aria-pressed={time === slot}
                  disabled={!date || !selectedService}
                  onClick={() => {
                    setTime(slot);
                    clearStatus();
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>

            {!selectedService && (
              <p className="booking-hint">Choose a service first.</p>
            )}

            {selectedService && !date && (
              <p className="booking-hint">Choose a date first.</p>
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

          {selectedService && date && time && (
            <div className="booking-summary">
              <h2>Appointment summary</h2>
              <p>{selectedService.name}</p>
              <p>
                {date} at {time}
              </p>
              <p>
                {selectedService.duration} · {selectedService.price}
              </p>
            </div>
          )}

          {status === "error" && (
            <p className="booking-error" role="alert">
              Please complete all required fields.
            </p>
          )}

          {status === "demo" && (
            <div className="booking-result" role="status">
              <strong>Demo request prepared</strong>
              <p>
                {selectedService.name} — {selectedService.price}
              </p>
              <p>
                {date} at {time}
              </p>
              <p>
                No request was sent and no appointment was reserved.
              </p>
            </div>
          )}

          <button className="booking-submit" type="submit">
            Review appointment request
          </button>
        </form>
      </section>
    </main>
  );
}
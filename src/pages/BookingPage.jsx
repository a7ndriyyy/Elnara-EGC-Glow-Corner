import React, { useState } from "react";
import "./BookingPage.css";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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

export default function BookingPage() {
  const today = formatDate(new Date());

  const limit = new Date();
  limit.setDate(limit.getDate() + 60);
  const maxDate = formatDate(limit);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();

    if (!date || !time || !name.trim() || !phone.trim() || !email.trim()) {
      setStatus("error");
      return;
    }

    // Prototype only: no data is sent and no appointment is reserved.
    setStatus("demo");
  }

  return (
    <main className="booking-page">
      <section className="booking-card">
        <p className="booking-eyebrow">ELNARA BEAUTY</p>

        <h1>Book an appointment</h1>

        <p className="booking-intro">
          Choose your preferred date and time, then leave your contact details.
        </p>

        <div className="booking-notice" role="note">
          <strong>Demo version</strong>
          <p>
            Time slots are examples and are not synchronized with a real
            calendar. Submitting this form does not reserve an appointment.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
              setStatus("idle");
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
                  disabled={!date}
                  onClick={() => {
                    setTime(slot);
                    setStatus("idle");
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>

            {!date && (
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
              setStatus("idle");
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
              setStatus("idle");
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
              setStatus("idle");
            }}
            required
          />

          {status === "error" && (
            <p className="booking-error" role="alert">
              Please complete all required fields.
            </p>
          )}

          {status === "demo" && (
            <div className="booking-result" role="status">
              <strong>Demo request prepared</strong>
              <p>
                Date: {date}
                <br />
                Time: {time}
              </p>
              <p>
                No request was sent and no appointment was reserved. A real
                booking service must be connected in the next phase.
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
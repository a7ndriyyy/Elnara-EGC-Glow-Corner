// Working hours, surcharges and tariffs (TZ step 7). Change values here — no code edits needed.
// TODO: уточнити в Ельнари — суми доплат (поки «індивідуально»).

export const pricingRules = {
  // Salon time zone: booking slots are interpreted in this zone.
  timeZone: "Europe/Paris",

  // Regular working hours ("HH:MM", 24 h). Bookings starting before `start`
  // or after `end` carry an out-of-hours surcharge.
  workingHours: { start: "09:00", end: "18:00" },

  // Saturday & Sunday and French public holidays are charged at this multiple.
  weekendMultiplier: 2,
  holidayMultiplier: 2,

  // Surcharge amounts in € — null means "individual, confirmed when booking".
  earlySurcharge: null,
  lateSurcharge: null,
  homeVisitSurcharge: null,
};

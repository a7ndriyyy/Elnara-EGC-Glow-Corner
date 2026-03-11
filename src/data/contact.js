// data/contact.js
export const contactData = {
  // Ці поля обов'язково мають бути!
  phone: "+1 234 567 890",           // ← було phoneLabel? зміни на phone!
  phoneDisplay: "+1 (234) 567-890",  // ← для відображення
  email: "contact@elnara.com",
  location: "1 Stanford Street, London, England",
  mapLink: "https://maps.google.com/?q=1+Stanford+Street+London",
  subtitle: "Зв'яжіться з нами",     // ← додай це поле
  title: "Contact us",                // ← додай це поле
  workingHours: [
    { days: "Mon - Fri", hours: "9am - 6pm" },
    { days: "Saturday", hours: "10am - 2pm" },
    { days: "Sunday", hours: "closed" }
  ],
  socials: [
    { icon: "FaFacebookF", link: "https://facebook.com", label: "Facebook" },
    { icon: "FaTwitter", link: "https://twitter.com", label: "Twitter" },
    { icon: "FaInstagram", link: "https://instagram.com", label: "Instagram" },
    { icon: "FaYoutube", link: "https://youtube.com", label: "YouTube" }
  ]
};
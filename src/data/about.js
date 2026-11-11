import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter, FaGlobe } from "react-icons/fa";

export const aboutData = {
  title: "About us",
  text: [
    "Present the most important information about your salon and show why your services are one of a kind. Make it clear what clients can expect and what benefits you bring.",
    "Share your approach, your style, and what makes your results consistent — comfort, hygiene, premium products, and attention to detail."
  ],
  socials: [
    { id: "fb", icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { id: "yt", icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
    { id: "ig", icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { id: "x", icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { id: "web", icon: FaGlobe, href: "https://elnara.com", label: "Website" }
  ],
  name: "Master Beauty Elnara",
  role: "Beauty specialist",
  // Elnara's real photo (public/Images). The hover swap in About.jsx picks from `images`,
  // so it only holds her own photos — no stock pictures labelled as Elnara.
  image: `${import.meta.env.BASE_URL}Images/elnara-hero.jpg`,
  images: {
    main: `${import.meta.env.BASE_URL}Images/elnara-hero.jpg`,
  }
};
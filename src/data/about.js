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
  image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  // Альтернативні зображення для різних типів
  images: {
    main: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    makeup: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    salon: "https://images.unsplash.com/photo-1560066984-13812e1f6d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
};
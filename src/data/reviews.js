import { FaStar, FaRegStar, FaQuoteRight } from "react-icons/fa";

// TODO: уточнити в Ельнари — це демо-відгуки; замінити на реальні відгуки клієнток.
// Optional per review: `photo` (photo of the work, e.g. `${import.meta.env.BASE_URL}Images/...`).
export const reviewsData = {
  title: "Reviews",
  subtitle: "Що кажуть клієнти",
  reviews: [
    {
      id: 1,
      name: "Miranda Nowak",
      rating: 4,
      text: "Very pleasant atmosphere, especially considering the difficult times we are all facing with the current pandemic. Extremely clean area! Greeted very warmly upon my entrance and seated almost immediately!",
      date: "March 2024",
      service: "Facial Treatment"
    },
    {
      id: 2,
      name: "Sophia Chen",
      rating: 5,
      text: "Absolutely amazing experience! Elnara is a true artist. She understood exactly what I wanted and delivered beyond expectations. The salon is spotless and the atmosphere is so relaxing.",
      date: "February 2024",
      service: "Evening Makeup"
    },
    {
      id: 3,
      name: "Emma Thompson",
      rating: 5,
      text: "The best beauty salon I've ever been to! Professional service, premium products, and incredible attention to detail. My skin has never looked better. Highly recommended!",
      date: "January 2024",
      service: "Chemical Peel"
    },
    {
      id: 4,
      name: "Olivia Martinez",
      rating: 5,
      text: "Elnara is a magician! She transformed my look for a special event and I received so many compliments. The consultation was thorough and she really listened to what I wanted.",
      date: "December 2023",
      service: "Bridal Makeup"
    }
  ]
};
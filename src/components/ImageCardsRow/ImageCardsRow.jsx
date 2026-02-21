import "./ImageCardsRow.css";
import { heroCards } from "../../data/images";

export default function ImageCardsRow() {
  return (
    <section className="cardsRow">
      <div className="container cardsRow__grid">
        {heroCards.map((card) => (
          <div key={card.id} className="cardsRow__card">
            <img
              className="cardsRow__img"
              src={card.src}
              alt={card.alt}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
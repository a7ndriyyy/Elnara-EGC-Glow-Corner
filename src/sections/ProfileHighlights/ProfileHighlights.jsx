import "./ProfileHighlights.css";
import { highlights } from "../../data/highlights";

export default function ProfileHighlights() {
  return (
    <section className="section highlights">
      <div className="container">
        <div className="highlights__grid">
          {highlights.map((h) => (
            <div key={h.id} className="highlights__card">
              <div className="highlights__title">{h.title}</div>
              <div className="highlights__text">{h.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
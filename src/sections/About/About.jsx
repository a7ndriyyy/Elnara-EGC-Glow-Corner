import "./About.css";
import { aboutData } from "../../data/about";

function SocialIcon({ id }) {
  // simple text-icons (no libs). Later we can replace with SVGs.
  const map = {
    fb: "f",
    yt: "▶",
    ig: "◎",
    x: "x",
    web: "h",
  };

  return <span className="about__icon">{map[id] ?? "•"}</span>;
}

export default function About() {
  return (
    <section id="about" className="about">
      <div className="about__wrap">
        <div className="about__image">
          <img src={aboutData.image} alt="About" />
        </div>

        <div className="about__panel">
          <div className="about__panelInner">
            <h2 className="about__title">{aboutData.title}</h2>

            {aboutData.text.map((p, idx) => (
              <p key={idx} className="about__text">
                {p}
              </p>
            ))}

            <div className="about__socials">
              {aboutData.socials.map((s) => (
                <a
                  key={s.id}
                  className="about__social"
                  href={s.href}
                  aria-label={s.label}
                >
                  <SocialIcon id={s.id} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
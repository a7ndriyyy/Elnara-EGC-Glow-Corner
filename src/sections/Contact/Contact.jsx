import "./Contact.css";
import { contactData } from "../../data/contact";

export default function Contact() {
  const { brand, contact, hours, form } = contactData;

  return (
    <section id="contact" className="contact">
      <div className="container contact__wrap">
        <div className="contact__col">
          <div className="contact__brand">{brand}</div>
          <div className="contact__blockTitle">Contact</div>

          <div className="contact__line">
            <span className="contact__label">{contact.phoneLabel}</span>
            <span className="contact__value">{contact.phone}</span>
          </div>

          <div className="contact__line">
            <span className="contact__label">{contact.emailLabel}</span>
            <span className="contact__value">{contact.email}</span>
          </div>

          <div className="contact__line">
            <span className="contact__label">{contact.locationLabel}</span>
            <span className="contact__value contact__value--pre">
              {contact.location}
            </span>
          </div>
        </div>

        <div className="contact__col">
          <div className="contact__blockTitle">{hours.title}</div>
          <div className="contact__hours">
            {hours.lines.map((l, idx) => (
              <div key={idx} className="contact__hoursLine">
                {l}
              </div>
            ))}
          </div>
        </div>

        <div className="contact__col contact__formCol">
          <div className="contact__formTitle">{form.title}</div>

          <form
            className="contact__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="contact__row">
              <div className="contact__field">
                <label className="contact__fieldLabel">Name</label>
                <input className="contact__input" type="text" />
              </div>

              <div className="contact__field">
                <label className="contact__fieldLabel">Email</label>
                <input className="contact__input" type="email" />
              </div>
            </div>

            <div className="contact__field">
              <label className="contact__fieldLabel">Information</label>
              <textarea className="contact__textarea" rows="3" />
            </div>

            <button className="contact__btn" type="submit">
              {form.button}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
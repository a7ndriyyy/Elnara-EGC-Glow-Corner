import "./Treatments.css";
import { treatmentsBlocks, treatmentsLists } from "../../data/treatments";

function ListCard({ heading, items }) {
  return (
    <div className="treatments__card treatments__card--list">
      <div className="treatments__listHead">{heading}</div>

      <div className="treatments__list">
        {items.map((it, idx) => (
          <div key={idx} className="treatments__item">
            <div className="treatments__itemTitle">{it.title}</div>
            <div className="treatments__itemDesc">{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageCard({ title, image, grayscale }) {
  return (
    <div className="treatments__card treatments__card--image">
      <div className="treatments__imgWrap">
        <img
          className={`treatments__img ${grayscale ? "isGray" : ""}`}
          src={image}
          alt={title}
        />
        <div className="treatments__imgTitle">{title}</div>
      </div>
    </div>
  );
}

export default function Treatments() {
  const faceList = treatmentsLists.find((x) => x.id === "face-list");
  const massageList = treatmentsLists.find((x) => x.id === "massage-list");
  const hairList = treatmentsLists.find((x) => x.id === "hair-list");

  return (
    <section id="treatments" className="section treatments">
      <div className="container">
        <h2 className="treatments__title">Our treatments</h2>

        <div className="treatments__grid">
          {/* Row 1 */}
          <ImageCard
            title={treatmentsBlocks.face.title}
            image={treatmentsBlocks.face.image}
          />
          <ListCard heading={faceList.heading} items={faceList.items} />

          {/* Row 2 */}
          <ListCard heading={massageList.heading} items={massageList.items} />
          <ImageCard
            title={treatmentsBlocks.body.title}
            image={treatmentsBlocks.body.image}
            grayscale={treatmentsBlocks.body.grayscale}
          />

          {/* Row 3 */}
          <ImageCard
            title={treatmentsBlocks.hairNails.title}
            image={treatmentsBlocks.hairNails.image}
          />
          <ListCard heading={hairList.heading} items={hairList.items} />
        </div>
      </div>
    </section>
  );
}
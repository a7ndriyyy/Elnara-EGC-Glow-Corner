// TEMPORARY photos for services that have no photo of Elnara's own work yet.
// Replace each entry with her real photo when she sends one (or delete the
// line — the card then shows a quiet panel with the first letter).
//
// Keys are service ids / slugs. Values are paths under public/Images.
// Stock/* are free photos from Unsplash (Unsplash License: free to use,
// commercial use allowed, no attribution required), source id in the name.
// Works/* and ImagesServices/* are photos already in the project.

const img = (path) => `${import.meta.env.BASE_URL}Images/${path}`;
const stock = (id) => img(`Stock/${id}.webp`);

const paths = {
  // permanent makeup
  "dark-lips-neutralization": stock("photo-1654374504608-67c4cfe65fca"),
  "lash-line-upper": stock("photo-1597826322461-9b11d306d08f"),
  "lash-line-lower": stock("photo-1613057388812-029549dc3d39"),
  "lash-line-both": stock("photo-1683719312734-e31de63957ab"),
  "beauty-mark": stock("photo-1611594547712-9e5d7da58684"),
  freckles: stock("photo-1554151228-14d9def656e4"),
  "retouch-6-12": img("Works/brows-powder-closeup.jpg"),
  "retouch-12-18": img("Works/brows-powder-3.jpg"),
  "pmu-cover": img("Works/brows-powder-before-after.jpg"),

  // makeup add-on
  "lash-clusters": stock("photo-1589710751893-f9a6770ad71b"),

  // brows & lashes
  "brow-shaping": stock("photo-1564278692313-b2d65996fc93"),
  "brow-tint": img("Works/brows-powder-2.webp"),
  "lash-tint": stock("photo-1587910234573-d6fc84743bc8"),
  "lash-lift": img("ImagesServices/lamination.webp"),
  "lash-lift-tint-botox": stock("photo-1772236617396-2f8460293c07"),
  "brow-lash-lift": img("Works/brows-lamination.jpg"),
  "brow-lash-full": img("Works/brows-portrait.webp"),

  // packages
  "pack-brow-beauty": img("Works/brows-lamination-before-after.jpg"),
  "pack-brow-premium": img("Works/brows-lamination.jpg"),
  "pack-full-beauty": img("ImagesServices/lamination.webp"),
  "pack-perfect-look": img("ImagesServices/makeup-evening.webp"),

  // laser tattoo removal
  "tattoo-consultation": stock("photo-1568515045052-f9a854d70bfd"),
  "tattoo-xs": stock("photo-1627960630431-270d04164a22"),
  "tattoo-s": stock("photo-1626215549618-f2f2aaff7d87"),
  "tattoo-m": stock("photo-1542727365-19732a80dcfd"),
  "tattoo-l": stock("photo-1593989716762-392976e5340f"),

  // permanent makeup removal (remover)
  "remover-consultation": stock("photo-1761718209852-54ca4210183e"),
  "remover-first": stock("photo-1761718210089-ba3bb5ccb54f"),
  "remover-next": stock("photo-1731514771613-991a02407132"),

  // massages
  "classic-back": stock("photo-1745327883508-b6cd32e5dde5"),
  "full-body": stock("photo-1519823551278-64ac92734fb1"),
  "anti-cellulite": stock("photo-1712638932314-e2b185ca0930"),
  lymphatic: stock("photo-1757689314932-bec6e9c39e51"),
  "face-neck": stock("photo-1643684391140-c5056cfd3436"),

  // device treatments
  "vacuum-massage": stock("photo-1639162906614-0603b0ae95fd"),
  pressotherapy: stock("photo-1741522509438-a120c0bb5e88"),
};

/** Temporary photo for a service id / slug, or null. */
export const tempImage = (id) => paths[id] ?? null;


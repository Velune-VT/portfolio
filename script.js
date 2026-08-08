/*
  Replace any empty image value below with your own artwork path, for example:
  image: "assets/halfbodies/example-01.webp"
  The first example in every category is the large lead diamond and still counts
  toward the seven total artworks.
*/

const portfolioData = {
  icons: category("Icons", "Portrait & profile artwork", ["#493080", "#b5689c"], "Icon", [
    ["Sketch", "$5"], ["Colored sketch", "$15"], ["Lined & shaded", "$20"],
    ["Rendered icon", "$20"], ["Colored sketch", "$15"], ["Sketch", "$5"], ["Lined & shaded", "$20"],
  ]),
  halfbodies: category("Halfbodies", "Waist-high character artwork", ["#573494", "#d078a5"], "Halfbody", [
    ["Sketch", "$15"], ["Colored sketch", "$25"], ["Lined & shaded", "$35"],
    ["Rendered halfbody", "$35"], ["Colored sketch", "$25"], ["Sketch", "$15"], ["Lined & shaded", "$35"],
  ]),
  fullbodies: category("Fullbodies", "Complete character artwork", ["#43308a", "#ba618e"], "Fullbody", [
    ["Sketch", "$20"], ["Colored sketch", "$35"], ["Lined & shaded", "$45"],
    ["Rendered fullbody", "$45"], ["Colored sketch", "$35"], ["Sketch", "$20"], ["Lined & shaded", "$45"],
  ]),
  illustrations: category("Illustrations", "Character scenes & atmosphere", ["#303b7e", "#b465a3"], "Illustration", [
    ["Simple scene", "$45+"], ["Character scene", "$55+"], ["Detailed scene", "$70+"],
    ["Featured scene", "$70+"], ["Character scene", "$55+"], ["Simple scene", "$45+"], ["Detailed scene", "$70+"],
  ]),
  customs: category("Customs", "Original character design", ["#603785", "#cf748d"], "Custom", [
    ["Simple design", "$20+"], ["Moderate design", "$35+"], ["Complex design", "$50+"],
    ["Featured design", "$50+"], ["Moderate design", "$35+"], ["Simple design", "$20+"], ["Complex design", "$50+"],
  ]),
  chibis: category("Chibis", "Tiny characters & motion", ["#4e318b", "#df7fad"], "Chibi", [
    ["Chibi", "$15"], ["Small animation", "$17+"], ["Chibi", "$15"],
    ["Featured chibi", "$15"], ["Small animation", "$17+"], ["Chibi", "$15"], ["Small animation", "$17+"],
  ]),
};

function category(title, subtitle, colors, prefix, prices) {
  const palettes = [
    ["#6e4cab", "#d47ca5"], ["#3f438d", "#9971bd"], ["#874678", "#dc90ad"],
    ["#4c3c91", "#ce79a3"], ["#39477f", "#ae6aa7"], ["#653b80", "#d18797"], ["#343e7c", "#a265b5"],
  ];
  return {
    title, subtitle, colors,
    examples: prices.map(([finish, price], index) => ({
      title: `${prefix} artwork ${index + 1}`,
      finish, price, image: "", colors: palettes[index],
    })),
  };
}

const categoryOrder = ["icons", "halfbodies", "fullbodies", "illustrations", "customs", "chibis"];
const homeLayout = document.querySelector("#homeLayout");
const galleryLayout = document.querySelector("#galleryLayout");
let activeCategory = null;

const featuredArtwork = {
  ...portfolioData.halfbodies.examples[3],
  title: "Featured artwork",
  finish: "Newest piece",
  price: "",
};

function createDiamond({ className = "", label, image = "", colors, onClick }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `diamond ${className}`;
  button.style.setProperty("--art-a", colors?.[0] || "#52358f");
  button.style.setProperty("--art-b", colors?.[1] || "#bd6d9c");
  if (image) button.style.setProperty("--image", `url("${image}")`);
  button.setAttribute("aria-label", label);
  button.addEventListener("click", onClick);
  return button;
}

function placeholderMarkup(item, index = "") {
  if (item.image) return "";
  return `<span class="placeholder-art" aria-hidden="true"><span>✦</span>${index ? `<b>${index}</b>` : ""}</span>`;
}

function renderHome() {
  homeLayout.innerHTML = "";
  categoryOrder.forEach((key, index) => {
    const data = portfolioData[key];
    const cover = data.examples[0];
    const diamond = createDiamond({
      className: `home-category pos-${index + 1}`,
      label: `Open ${data.title} examples and prices`,
      image: cover.image,
      colors: cover.colors,
      onClick: () => openCategory(key),
    });
    diamond.innerHTML = `${placeholderMarkup(cover)}<span class="home-label">${data.title}</span>`;
    homeLayout.appendChild(diamond);
  });

  const center = createDiamond({
    className: "featured-home pos-featured",
    label: "Enlarge featured artwork",
    image: featuredArtwork.image,
    colors: featuredArtwork.colors,
    onClick: () => openLightbox(featuredArtwork),
  });
  center.innerHTML = `${placeholderMarkup(featuredArtwork)}<span class="home-label"><small>Newest</small>Featured artwork</span>`;
  homeLayout.appendChild(center);

  const tos = createDiamond({
    className: "tos-diamond pos-tos",
    label: "Open commission information and terms of service",
    colors: ["#35205f", "#8b4d83"],
    onClick: openTos,
  });
  tos.innerHTML = `<span class="back-label"><span>✦</span> Info / TOS</span>`;
  homeLayout.appendChild(tos);
}

function openCategory(key) {
  activeCategory = key;
  renderGallery(key);
  homeLayout.hidden = true;
  galleryLayout.hidden = false;
}

function artworkCaption(example, categoryTitle = "") {
  return `<span class="example-caption">${categoryTitle ? `<em>${categoryTitle}</em>` : ""}<strong>${example.finish}</strong><span>${example.price}</span></span>`;
}

function renderGallery(key) {
  const data = portfolioData[key];
  galleryLayout.innerHTML = "";

  data.examples.forEach((example, index) => {
    const position = index === 0 ? "pos-lead" : `pos-art-${index}`;
    const diamond = createDiamond({
      className: `example-diamond ${index === 0 ? "lead-artwork" : ""} ${position}`,
      label: `${example.title}. ${example.finish}, ${example.price}. Enlarge artwork.`,
      image: example.image,
      colors: example.colors,
      onClick: () => openLightbox(example),
    });
    diamond.innerHTML = `${placeholderMarkup(example, index + 1)}${artworkCaption(example, index === 0 ? data.title : "")}`;
    galleryLayout.appendChild(diamond);
  });

  const back = createDiamond({
    className: "back-diamond pos-back",
    label: "Back to commission categories",
    colors: data.colors,
    onClick: closeCategory,
  });
  back.innerHTML = `<span class="back-label"><span>←</span> Back</span>`;
  galleryLayout.appendChild(back);
}

function closeCategory() {
  activeCategory = null;
  galleryLayout.hidden = true;
  homeLayout.hidden = false;
}

function openLightbox(example) {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", example.title);
  const imageStyle = example.image
    ? `--image: url('${example.image}')`
    : `--image: linear-gradient(145deg, ${example.colors[0]}, ${example.colors[1]})`;
  const details = [example.finish, example.price].filter(Boolean).join(" · ");
  overlay.innerHTML = `<div class="lightbox-card" style="${imageStyle}"><button class="lightbox-close" type="button" aria-label="Close artwork">×</button><div class="lightbox-placeholder" aria-hidden="true">✦</div><div class="lightbox-copy"><strong>${example.title}</strong>${details ? `<span>${details}</span>` : ""}</div></div>`;
  const close = () => { overlay.remove(); document.removeEventListener("keydown", onKeyDown); };
  const onKeyDown = (event) => { if (event.key === "Escape") close(); };
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  overlay.querySelector(".lightbox-close").addEventListener("click", close);
  document.addEventListener("keydown", onKeyDown);
  document.body.appendChild(overlay);
  overlay.querySelector(".lightbox-close").focus();
}

function openTos() {
  const overlay = document.createElement("div");
  overlay.className = "tos-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "tos-title");
  overlay.innerHTML = `
    <article class="tos-card">
      <button class="tos-close" type="button" aria-label="Close terms of service">×</button>
      <p class="tos-kicker">Commission Information</p>
      <h2 id="tos-title">Terms of Service</h2>
      <div class="tos-copy">
        <section><h3>Before ordering</h3><p>Please provide clear visual references and a concise description of the artwork you would like. I may decline a commission that falls outside my comfort level or current availability.</p></section>
        <section><h3>Payment</h3><p>Payment is due before work begins unless we agree to another arrangement. Prices may increase for complex characters, detailed props, backgrounds, or additional revisions.</p></section>
        <section><h3>Process & revisions</h3><p>You will receive progress updates at the sketch stage. Reasonable sketch revisions are included; major changes requested after approval may require an additional fee.</p></section>
        <section><h3>Usage</h3><p>Commissioned artwork is for personal use unless commercial rights are purchased separately. You may crop or resize the finished work, but please do not remove my signature, claim the artwork as your own, or use it for AI training or NFTs.</p></section>
        <section><h3>Turnaround & refunds</h3><p>Turnaround depends on complexity and queue length. Refunds are considered according to how much work has been completed. Completed commissions are non-refundable.</p></section>
        <section><h3>Artist rights</h3><p>I retain authorship of the artwork and may display it in my portfolio or social media unless privacy is arranged before ordering.</p></section>
      </div>
      <p class="tos-note">Replace this sample wording in <strong>script.js</strong> with your final commission policies.</p>
    </article>`;
  const close = () => { overlay.remove(); document.removeEventListener("keydown", onKeyDown); };
  const onKeyDown = (event) => { if (event.key === "Escape") close(); };
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  overlay.querySelector(".tos-close").addEventListener("click", close);
  document.addEventListener("keydown", onKeyDown);
  document.body.appendChild(overlay);
  overlay.querySelector(".tos-close").focus();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeCategory && !document.querySelector(".lightbox")) closeCategory();
});

renderHome();

/* Keeps a cross-origin Carrd iframe exactly as tall as this transparent page. */
function reportPortfolioHeight() {
  const height = Math.ceil(document.querySelector(".portfolio-shell").getBoundingClientRect().height);
  window.parent.postMessage({ type: "velune-portfolio-height", height }, "*");
}

new ResizeObserver(reportPortfolioHeight).observe(document.querySelector(".portfolio-shell"));
window.addEventListener("load", reportPortfolioHeight);
window.addEventListener("resize", reportPortfolioHeight);
setTimeout(reportPortfolioHeight, 150);

import { readBlockConfig } from "../../scripts/lib-franklin.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = "";

  // fetch footer content
  const footerPath = cfg.footer || "/footer";
  const resp = await fetch(
    `${footerPath}.plain.html`,
    window.location.pathname.endsWith("/footer") ? { cache: "reload" } : {}
  );

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement("div");
    footer.innerHTML = html;

    const links = footer.querySelectorAll("a");
    links.forEach((l) => {
      if (l.querySelector("img")) {
        l.setAttribute("aria-label", "Linkedin");
      }
    });

    const backgroundImage = footer
      .querySelector(".background")
      .querySelector("img");
    footer.style.backgroundImage = `url(${backgroundImage.src})`;
    footer.style.backgroundSize = "cover";
    block.append(footer);
  }
}

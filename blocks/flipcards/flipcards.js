import {
  createCarouselArrow,
  createOptimizedPicture,
} from "../../scripts/lib-franklin.js";

var mediumSize = window.matchMedia(
  "(max-width: 1350px) and (min-width: 768px)"
);
const SCROLL_DISTANCE = 255;
var smallSize = window.matchMedia("(max-width: 768px)");
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row, i) => {
    const li = document.createElement("li");
    const outerDiv = document.createElement("div");
    outerDiv.innerHTML = row.innerHTML;

    [...outerDiv.children].forEach((div, idx) => {
      if (idx === 0) {
        div.className = "background";
        const img = div.querySelector("img");
        li.style.backgroundImage = `url(${img.src})`;
        li.style.backgroundSize = "cover";
      } else if (idx === 1) {
        div.className = "cards-card-image-flip";
      } else if (idx === 2) {
        div.className = "cards-card-body-flip";
        div.classList.add("hidden");
      }
    });
    if (i === 0) {
      li.className = "row-2";
      const link = document.createElement("a");
      link.href = outerDiv.querySelector("a").href;
      link.append(outerDiv);
      li.append(link);
    } else {
      li.className = "row-1";
      let cardsBody = outerDiv.children[2];
      const originalContent = cardsBody.innerHTML;
      // check if the text should change
      changeBriefText(cardsBody, originalContent);
      mediumSize.addEventListener("change", () => {
        changeBriefText(cardsBody, originalContent);
      });

      outerDiv.addEventListener("click", () => {
        if (cardsBody.classList.contains("hidden")) {
          cardsBody.classList.remove("hidden");
        } else {
          cardsBody.classList.add("hidden");
        }
      });
      li.append(outerDiv);
    }
    ul.append(li);
  });

  ul.querySelectorAll("img").forEach((img) =>
    img
      .closest("picture")
      .replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      )
  );

  block.textContent = "";
  block.append(ul);

  // append arrows for carousel if needed
  addCarousel(block, ul);
  smallSize.addEventListener("change", () => {
    addCarousel(block, ul);
  });
}

const changeBriefText = (cardsBody, originalContent) => {
  const linkHref = cardsBody.querySelector("a").getAttribute("href");

  if (mediumSize.matches) {
    cardsBody.innerHTML = `<div><a class="contact-us-link" href=${linkHref}>Contact us</a> to learn more about this project</div>`;
  } else {
    cardsBody.innerHTML = originalContent;
  }
};

const addCarousel = (block, ul) => {
  const moveLeft = () => {
    ul.scroll({
      left: ul.scrollLeft - SCROLL_DISTANCE,
      behavior: "smooth",
    });
  };
  const moveRight = () => {
    ul.scroll({
      left: ul.scrollLeft + SCROLL_DISTANCE,
      behavior: "smooth",
    });
  };

  const arrowDiv = createCarouselArrow(moveLeft, moveRight);

  if (smallSize.matches) {
    block.append(arrowDiv);
  } else {
    const arrowDiv = block.querySelector(".arrow-div");
    if (arrowDiv) {
      block.removeChild(arrowDiv);
    }
  }
};

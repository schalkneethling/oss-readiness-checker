import { getIcon } from "../utils/svg-icon-util.js";

export class SVGIcon extends HTMLElement {
  static observedAttributes = ["name"];

  #data = {
    iconName: this.getAttribute("name"),
  };

  #svgAttrs = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
  };

  constructor() {
    super();

    this.#svgAttrs.height = this.getAttribute("height") || "24";
    this.#svgAttrs.width = this.getAttribute("width") || "24";
    this.#svgAttrs.viewBox = `0 0 ${this.#svgAttrs.width} ${this.#svgAttrs.height}`;

    // This component can also be added to the DOM dynamically in which case it will first be created
    // without the `name` attribute. Calling `this.#renderIcon` while `iconName` is undefined will
    // trigger an error.
    if (this.#data.iconName) {
      this.#renderIcon(this.#data.iconName);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "name" && oldValue !== newValue) {
      this.#renderIcon(newValue);
    }
  }

  #renderIcon = async (iconName) => {
    const icon = await getIcon(iconName);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.append(...icon.childNodes);

    Object.keys(this.#svgAttrs).forEach((attr) => {
      svg.setAttribute(attr, this.#svgAttrs[attr]);
    });

    svg.classList.add("icon", `icon-${iconName}`);

    this.append(svg);
  };
}

customElements.define("svg-icon", SVGIcon);

export class NoteCard extends HTMLElement {
  static #selectors = {
    template: "#notecard",
    title: ".notecard-title",
    content: ".notecard-content",
  };

  #elements = {
    template: document.querySelector(NoteCard.#selectors.template),
  };

  #data = {
    noteLookupKey: this.getAttribute("note"),
    variant: this.getAttribute("variant"),
  };

  #strings;

  constructor() {
    super();

    this.#loadStrings().then(() => {
      this.#renderNotecard(this.#data);
    });
  }

  async #loadStrings() {
    try {
      const response = await fetch("../../data/strings.json");

      if (response && response.ok) {
        this.#strings = await response.json();
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  #renderNotecard({ variant, noteLookupKey }) {
    const note = this.#strings[noteLookupKey];

    if (!note) {
      throw new Error(`Note not found for key: ${noteLookupKey}`);
    }

    const template = this.#elements.template.content.cloneNode(true);
    const title = template.querySelector(NoteCard.#selectors.title);
    const content = template.querySelector(NoteCard.#selectors.content);
    const svg = document.createElement("svg-icon");

    svg.setAttribute("name", variant);
    title.textContent = note.title;
    content.textContent = note.content;

    // Because the template is a `DocumentFragment`, we can't use `insertAdjacentElement`
    // on the template. Instead, we use it on the `title` element inside the template.
    title.parentElement.insertAdjacentElement("beforebegin", svg);

    this.append(template);
  }
}

customElements.define("note-card", NoteCard);

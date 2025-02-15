export class ReadinessCheckercategory extends HTMLElement {
  static #selectors = {
    categoryItemTmpl: "#category-item",
    progress: "progress",
  };

  #elements = {
    categoryItemTmpl: this.querySelector(
      ReadinessCheckercategory.#selectors.categoryItemTmpl,
    ),
    progress: document.querySelector(
      ReadinessCheckercategory.#selectors.progress,
    ),
  };

  #categories = {
    documentation: {
      title: "Documentation",
      items: [
        { name: "Comprehensive README", required: true },
        { name: "Contributing guidelines", required: true },
        { name: "Code of conduct", required: true },
        { name: "API documentation", required: false },
        { name: "Installation/setup guide", required: true },
        { name: "Usage examples", required: true },
        { name: "License file", required: true },
      ],
    },
    technical: {
      title: "Technical",
      items: [
        { name: "Security review completed", required: true },
        { name: "Dependency audit completed", required: true },
        { name: "CI/CD pipelines configured", required: false },
        { name: "Test coverage adequate", required: false },
        { name: "Performance benchmarks established", required: false },
        { name: "Code quality tools configured", required: false },
      ],
    },
    community: {
      title: "Community",
      items: [
        { name: "Issue templates created", required: false },
        { name: "PR templates created", required: false },
        { name: "Communication channels established", required: true },
        { name: "Maintainer guidelines documented", required: true },
        { name: "Support process defined", required: true },
        { name: "Release process documented", required: true },
      ],
    },
    business: {
      title: "Business",
      items: [
        { name: "Marketing plan prepared", required: false },
        { name: "Success metrics defined", required: false },
        { name: "Resource allocation confirmed", required: true },
        { name: "Maintenance budget approved", required: true },
        { name: "Legal review completed", required: true },
        { name: "Executive approval obtained", required: true },
      ],
    },
  };

  #requiredItems = [];

  constructor() {
    super();

    this.#requiredItems = Object.values(this.#categories).reduce(
      (acc, category) => {
        const requiredItems = category.items.filter((item) => item.required);
        const requiredItemNames = requiredItems.map((item) => item.name);
        return [...acc, ...requiredItemNames];
      },
      [],
    );
    this.#renderCategories();
    this.#addEventListeners();
  }

  #getItemsForCategory(items, categoryName) {
    const unorderedList = document.createElement("ul");
    const categorItems = items.map((item) => {
      const { categoryItemTmpl } = this.#elements;
      const categoryItemTmplClone = categoryItemTmpl.content.cloneNode(true);
      const checkbox = categoryItemTmplClone.querySelector("input");
      const id = item.name
        .replace(/\s/g, "-")
        .replace(/[^a-zA-Z0-9- ]/g, "")
        .toLowerCase();
      const label = categoryItemTmplClone.querySelector("label");

      checkbox.id = id;
      checkbox.name = categoryName.toLowerCase();
      checkbox.dataset.itemName = item.name;

      label.htmlFor = id;
      label.textContent = item.name;

      return categoryItemTmplClone;
    });

    unorderedList.classList.add("reset-list");
    unorderedList.append(...categorItems);

    return unorderedList;
  }

  #renderCategories() {
    const categoryKeys = Object.keys(this.#categories);

    const categories = categoryKeys.map((categoryKey) => {
      const categoryTitle = this.#categories[categoryKey].title;
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");

      fieldset.appendChild(legend);
      legend.textContent = categoryTitle;

      fieldset.append(
        this.#getItemsForCategory(
          this.#categories[categoryKey].items,
          categoryTitle,
        ),
      );

      return fieldset;
    });

    this.append(...categories);
  }

  #addEventListeners() {
    const { progress } = this.#elements;
    const requiredItemsTotal = this.#requiredItems.length;
    let requiredItemsChecked = 0;

    this.addEventListener("input", (event) => {
      const { target } = event;
      if (target.type === "checkbox") {
        const isChecked = target.checked;
        const item = this.#requiredItems.includes(target.dataset.itemName);

        if (item) {
          isChecked ? requiredItemsChecked++ : requiredItemsChecked--;
        }

        progress.value = (
          (requiredItemsChecked / requiredItemsTotal) *
          100
        ).toFixed(2);
      }
    });
  }
}

customElements.define("readiness-checker-category", ReadinessCheckercategory);

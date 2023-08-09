const Collapsible = (options) => {
  const defaultOptions = {
    triggerSelector: "[data-collapsible-trigger]",
    contentSelector: "[data-collapsible-content]",
    activeClass: "active",
    visibleClass: "visible",
  };

  const settings = { ...defaultOptions, ...options };

  function init() {
    const triggerElements = document.querySelectorAll(settings.triggerSelector);
    triggerElements.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const content = trigger.nextElementSibling;
        toggleCollapsible(trigger, content);
      });
    });
  }

  function toggleCollapsible(triggerElement, contentElement) {
    if (!contentElement) return;

    if (contentElement.classList.contains(settings.visibleClass)) {
      contentElement.classList.remove(settings.visibleClass);
      triggerElement.classList.remove(settings.activeClass);
    } else {
      contentElement.classList.add(settings.visibleClass);
      triggerElement.classList.add(settings.activeClass);
    }
  }

  return {
    init,
    toggleCollapsible,
  };
};

export default Collapsible;

const Collapsible = (options) => {
  const defaultOptions = {
    triggerSelector: "data-collapsible-trigger",
    contentSelector: "data-collapsible-content",
    activeClass: "is-active",
    visibleClass: "is-visible",
  };

  const settings = { ...defaultOptions, ...options };

  const init = () => {
    const triggerElements = document.querySelectorAll(`[${settings.triggerSelector}]`);
    triggerElements.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const collapsibleIdentifier = trigger.getAttribute(settings.triggerSelector);
        const contentElements = document.querySelectorAll(
          `[${settings.contentSelector}="${collapsibleIdentifier}"]`
        );
        toggleCollapsible(trigger, contentElements);
      });
    });
  };

  const toggleCollapsible = (triggerElement, contentElements) => {
    if (!contentElements) return;

    contentElements.forEach((contentElement) => {
      if (contentElement.classList.contains(settings.visibleClass)) {
        contentElement.classList.remove(settings.visibleClass);
        triggerElement.classList.remove(settings.activeClass);
        toggleContent(contentElement);
      } else {
        contentElement.classList.add(settings.visibleClass);
        triggerElement.classList.add(settings.activeClass);
        toggleContent(contentElement);
      }
    });
  };

  const toggleContent = (el) => {
    if (!el) {
      console.error("The element with the provided identifier doesn't exist.");
      return;
    }

    let contentHeight;
    const isHidden = el.style.display === "none" || el.style.display === "";

    if (isHidden) {
      el.style.display = "block";
      el.style.opacity = "1";

      contentHeight = el.scrollHeight;

      el.style.maxHeight = contentHeight + "px";

      el.addEventListener(
        "transitionend",
        function onTransitionEnd() {
          el.style.maxHeight = "fit-content";
          el.removeEventListener("transitionend", onTransitionEnd);
        },
        { once: true }
      );
    } else {
      contentHeight = el.scrollHeight;
      el.style.maxHeight = contentHeight + "px";
      el.offsetHeight;

      el.style.maxHeight = "0";
      el.style.opacity = "0";

      el.addEventListener(
        "transitionend",
        function onTransitionEnd() {
          el.style.display = "none";
          el.style.maxHeight = "0";
          el.style.opacity = "0";
          el.removeEventListener("transitionend", onTransitionEnd);
        },
        { once: true }
      );
    }
  };

  return {
    init,
    toggleCollapsible,
  };
};

export default Collapsible;

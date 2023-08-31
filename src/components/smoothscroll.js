const SmoothScroll = (options) => {
  const defaultOptions = {
    scrollTrigger: "data-scroll",
    scrollOffset: "data-scroll-offset",
    sectionIdentifier: "data-section",
  };

  const settings = { ...defaultOptions, ...options };

  const getOffsetTop = (el) => {
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return rect.top + scrollTop;
  };

  const scrollToPosition = (targetPosition) => {
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  const scrollTop = () => {
    scrollToPosition(0);
  };

  const scrollBottom = () => {
    scrollToPosition(document.body.scrollHeight);
  };

  const scrollTarget = (element, offset = 0) => {
    const target = document.querySelector(`[${settings.sectionIdentifier}="${element}"]`);
    if (target) {
      const targetPosition = getOffsetTop(target) - offset;
      scrollToPosition(targetPosition);
    }
  };

  const init = () => {
    const anchors = document.querySelectorAll(`[${settings.scrollTrigger}]`);

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();

        const element = anchor.getAttribute(settings.scrollTrigger);
        const offset = parseInt(anchor.getAttribute(settings.scrollOffset), 10) || 0;

        if (element === "top") {
          scrollTop();
        } else if (element === "bottom") {
          scrollBottom();
        } else {
          scrollTarget(element, offset);
        }
      });
    });
  };

  return {
    init,
    scrollTarget,
    scrollTop,
    scrollBottom,
  };
};

export default SmoothScroll;

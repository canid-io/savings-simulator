/**
 * Collapsible module to create expandable/collapsible sections.
 * @module Collapsible
 */

/**
 * Toggles the visibility of the collapsible content when a trigger is clicked.
 * @private
 * @param {Event} event - The click event object.
 */
function toggleCollapsible(event) {
  const collapsibleItem = event.currentTarget;
  const contentSelector = collapsibleItem.dataset.collapsibleContent;
  const collapsibleContent = collapsibleItem.querySelector(contentSelector);

  if (collapsibleContent) {
    collapsibleItem.classList.toggle(settings.activeClass);
    collapsibleContent.classList.toggle(settings.visibleClass);
  }
}

/**
 * Initializes the Collapsible module with the given options.
 * @public
 * @param {Object} options - The configuration options for the Collapsible module.
 * @param {string} [options.triggerSelector="[data-collapsible-trigger]"] - The selector for the collapsible trigger elements.
 * @param {string} [options.contentSelector="[data-collapsible-content]"] - The selector for the collapsible content elements.
 * @param {string} [options.activeClass="active"] - The class name for the active (expanded) state of the collapsible item.
 * @param {string} [options.visibleClass="visible"] - The class name for the visible state of the collapsible content.
 */
function init(options) {
  const defaultOptions = {
    triggerSelector: '[data-collapsible-trigger]',
    contentSelector: '[data-collapsible-content]',
    activeClass: 'active',
    visibleClass: 'visible'
  };

  const settings = { ...defaultOptions, ...options };

  const collapsibleTriggers = document.querySelectorAll(settings.triggerSelector);
  collapsibleTriggers.forEach(trigger => {
    trigger.addEventListener('click', toggleCollapsible);
  });
}

/**
 * Collapsible module.
 * @namespace Collapsible
 */
const Collapsible = (() => {
  return {
    init
  };
})();

export default Collapsible;
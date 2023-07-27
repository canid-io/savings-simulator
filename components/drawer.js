/**
 * Drawer module to handle the interaction of multiple drawers.
 * @module Drawer
 */

/**
 * Drawer configuration options.
 * @typedef {Object} DrawerOptions
 * @property {string} triggerSelector - The selector for the drawer trigger elements.
 * @property {string} drawerAttribute - The attribute used to identify the drawer (data attribute name).
 * @property {string} openClass - The class name for the open (visible) state of the drawer.
 */

/**
 * Drawer module to handle the interaction of multiple drawers.
 * @param {DrawerOptions} options - The configuration options for the Drawer module.
 * @returns {Object} - An object with methods to control the drawers.
 */
const Drawer = (options) => {
  const defaultOptions = {
    triggerSelector: '[data-drawer-trigger]',
    drawerAttribute: '[data-drawer]',
    openClass: 'open',
  };

  const settings = { ...defaultOptions, ...options };
  let openDrawerName = null;

  /**
   * Opens a specific drawer.
   * @param {string} drawerName - The name of the drawer to be opened.
   */
  function openDrawer(drawerName) {
    const drawer = document.querySelector(`${settings.drawerAttribute}="${drawerName}"`);
    if (drawer) {
      if (openDrawerName !== null) {
        closeDrawer(openDrawerName);
      }
      drawer.classList.add(settings.openClass);
      openDrawerName = drawerName;
    }
  }

  /**
   * Closes a specific drawer.
   * @param {string} drawerName - The name of the drawer to be closed.
   */
  function closeDrawer(drawerName) {
    const drawer = document.querySelector(`${settings.drawerAttribute}="${drawerName}"`);
    if (drawer) {
      drawer.classList.remove(settings.openClass);
      openDrawerName = null;
    }
  }

  /**
   * Toggles a specific drawer.
   * @param {string} drawerName - The name of the drawer to be toggled.
   */
  function toggleDrawer(drawerName) {
    if (openDrawerName === drawerName) {
      closeDrawer(drawerName);
    } else {
      openDrawer(drawerName);
    }
  }

  /**
   * Initializes the Drawer module with the given options.
   */
  function init() {
    const triggerButtons = document.querySelectorAll(settings.triggerSelector);
    triggerButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const drawerName = button.getAttribute(settings.drawerAttribute);
        toggleDrawer(drawerName);
      });
    });
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

export default Drawer;

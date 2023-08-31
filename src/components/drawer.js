const Drawer = (options) => {
  const defaultOptions = {
    drawerTrigger: "data-drawer-trigger",
    drawerIdentifier: "data-drawer",
    openClass: "is-open",
  };

  const settings = { ...defaultOptions, ...options };

  const openDrawer = (drawerName) => {
    const drawer = getDrawerElement(drawerName);
    if (!drawer) {
      console.error(`Drawer with name ${drawerName} not found.`);
      return;
    }

    drawer.classList.add(settings.openClass);
    toggleBodyOverflow(true);
  };

  const closeDrawer = (drawerName) => {
    const drawer = getDrawerElement(drawerName);
    if (!drawer) {
      console.error(`Drawer with name ${drawerName} not found.`);
      return;
    }

    drawer.classList.remove(settings.openClass);
    toggleBodyOverflow(false);
  };

  const toggleDrawer = (drawerName) => {
    const drawer = getDrawerElement(drawerName);
    if (!drawer) {
      console.error(`Drawer with name ${drawerName} not found.`);
      return;
    }

    if (drawer.classList.contains(settings.openClass)) {
      closeDrawer(drawerName);
    } else {
      openDrawer(drawerName);
    }
  };

  const init = () => {
    const triggerElements = document.querySelectorAll(
      `[${settings.drawerTrigger}]`
    );
    triggerElements.forEach((el) => {
      el.addEventListener("click", () => {
        const drawerName = el.getAttribute(settings.drawerTrigger);
        cleanDrawers(drawerName);
        toggleDrawer(drawerName);
      });
    });
  };

  const getDrawerElement = (drawerName) => {
    return document.querySelector(
      `[${settings.drawerIdentifier}="${drawerName}"]`
    );
  };

  const cleanDrawers = (targetDrawer) => {
    const openDrawers = document.querySelectorAll(`[${settings.drawerIdentifier}].${settings.openClass}`);
    openDrawers.forEach((drawer) => {
      const openDrawerIdentifier = drawer.getAttribute(settings.drawerIdentifier);
      if (openDrawerIdentifier !== targetDrawer) {
        closeDrawer(openDrawerIdentifier);
      }
    });
  };

  const toggleBodyOverflow = (shouldHide) => {
    document.body.style.overflow = shouldHide ? "hidden" : "auto";
  };

  return {
    init,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    cleanDrawers,
  };
};

export default Drawer;

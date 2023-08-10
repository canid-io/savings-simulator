const Drawer = (options) => {
  const defaultOptions = {
    drawerTrigger: "data-drawer-trigger",
    drawerIdentifier: "data-drawer",
    openClass: "is-open",
  };

  const settings = { ...defaultOptions, ...options };
  let openDrawerName = null;

  function openDrawer(drawerName) {
    const drawer = getDrawerElement(drawerName);
    if (!drawer) {
      console.error(`Drawer with name ${drawerName} not found.`);
      return;
    }

    closeOpenDrawer();
    drawer.classList.add(settings.openClass);
    openDrawerName = drawerName;
    toggleBodyOverflow(true);
  }

  function closeDrawer(drawerName) {
    const drawer = getDrawerElement(drawerName);
    if (!drawer) {
      console.error(`Drawer with name ${drawerName} not found.`);
      return;
    }

    drawer.classList.remove(settings.openClass);
    openDrawerName = null;
    toggleBodyOverflow(false);
  }

  function toggleDrawer(drawerName) {
    if (openDrawerName === drawerName) {
      closeDrawer(drawerName);
    } else {
      openDrawer(drawerName);
    }
  }

  function init() {
    const triggerElements = document.querySelectorAll(
      `[${settings.drawerTrigger}]`
    );
    triggerElements.forEach((el) => {
      el.addEventListener("click", () => {
        const drawerName = el.getAttribute(settings.drawerTrigger);
        toggleDrawer(drawerName);
      });
    });
  }

  function getDrawerElement(drawerName) {
    return document.querySelector(
      `[${settings.drawerIdentifier}="${drawerName}"]`
    );
  }

  function closeOpenDrawer() {
    if (openDrawerName !== null) {
      closeDrawer(openDrawerName);
    }
  }

  function toggleBodyOverflow(shouldHide) {
    document.body.style.overflow = shouldHide ? "hidden" : "auto";
  }

  return {
    init,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};

export default Drawer;

import Drawer from './drawer';

const Simulator = () => {
  const init = () => {
    const forms = document.querySelectorAll("[data-form]");
    forms.forEach((form) => {

      // Webflow form
      const webflowForm = form.closest('.w-form');
      if (webflowForm) {
        webflowForm.classList.remove('w-form');
      }

      // Update EstYearlyVaxAdmin
      const pediatricProvidersInput = document.querySelector('[data-input="pediatricProviders"]');
      if (pediatricProvidersInput) {
        pediatricProvidersInput.addEventListener('input', (event) => {
          const newValue = event.target.value;
          updateEstYearlyVaxAdmin(newValue);
        });
      } else {
        console.error("Element with data-input='pediatricProviders' not found.");
      }

      // Simulation
      form.onsubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {};

        const originalKeys = Array.from(formData.keys());
        const renamedKeys = [
          'vaccineManagement',
          'pediatricProviders',
          'percentageVFC',
          'billingFee',
        ];

        formData.forEach((value, key) => {
          const originalKeyIndex = originalKeys.indexOf(key);
          const renamedKey = renamedKeys[originalKeyIndex] || key;
          data[renamedKey] = value;
        });

        // General
        data.estYearlyVaxAdmin = parseInt(data.pediatricProviders) * 3850 / 2;

        // Money
        data.vaccineFees = data.estYearlyVaxAdmin * ( 1 - parseInt(data.percentageVFC) ) * 100;
        data.adminFees = data.estYearlyVaxAdmin * ( 1 - parseInt(data.percentageVFC) ) * 20 + data.estYearlyVaxAdmin * ( 1 - parseInt(data.percentageVFC) ) * 35;
        data.hoursSpentCost = sumProduct([data.purchasingVaccines, data.inventoryControl, data.reviewVaccinationHistory, data.ehrDataEntry, data.iisHandling, data.billsHandling], [50, 50, 150, 50, 50, 40]);
        data.vaccineWastage = -1 * (data.vaccineFees * 0.02);
        data.paymentIssues = -1 * ((data.vaccineFees + data.adminFees) * 0.05);
        data.billingFeeCost = (data.billingFee !== "In-house" ? data.billingFee : 0) * (data.vaccineFees + data.adminFees);;
        data.vaccineCosts = -1 * (data.vaccineFees * 0.825);
        data.totalVaxCost = sumValues([data.timeExpenses, data.vaccineWastag, data.paymentIssues, data.billingFeeCost, data.vaccineCosts]);

        // Time
        data.purchasingVaccines = 0.5 * data.estYearlyVaxAdmin / 60;
        data.inventoryControl = 1 * data.estYearlyVaxAdmin / 60;
        data.reviewVaccinationHistory = 1 * data.estYearlyVaxAdmin / 60;
        data.ehrDataEntry = 3 * data.estYearlyVaxAdmin / 60;
        data.iisHandling = 0.5 * data.estYearlyVaxAdmin / 60;
        data.billsHandling = 0.5 * data.estYearlyVaxAdmin / 60;
        data.yearlyTimeExpenses = sumValues([data.purchasingVaccines, data.inventoryControl, data.reviewVaccinationHistory, data.ehrDataEntry, data.iisHandling, data.billsHandling]);

        // Savings
        data.totalRevenue = sumValues([data.totalVaxCost, data.adminFees, data.vaccineFees]);
        data.totalRevenueWithCanid = data.adminFees;

        // Display simulation results
        displayResults(data);

        // Drawer
        const drawer = Drawer();
        const identifyDrawer = form.closest('[data-drawer]');

        if (identifyDrawer) {
          const drawerName = identifyDrawer.getAttribute('data-drawer');
          drawer.closeDrawer(drawerName);
        }

        // Show results section
        toggleSection('results', '[data-simulation]');

      };
    });
  };

  const displayResults = (data) => {
    const resultElements = document.querySelectorAll('[data-result]');

    resultElements.forEach((element) => {
      const key = element.getAttribute('data-result');

      if (key in data) {
        const value = data[key];
        if (typeof value === 'number' && !isNaN(value)) {
          element.textContent = value.toLocaleString('en-US');
        } else {
          element.textContent = value;
        }
      }
    });
  };

  const sumValues = input => {
    if (Array.isArray(input)) {
      return input.reduce((acc, curr) => acc + curr, 0);
    } else if (typeof input === 'object') {
      return Object.values(input)
        .filter(value => typeof value === 'number')
        .reduce((acc, curr) => acc + curr, 0);
    } else {
      return 0;
    }
  };

  const sumProduct = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      console.error('Arrays must have the same length to calculate the product and sum.');
      return;
    }
    return arr1.reduce((total, value, index) => {
      if (typeof value === 'number' && typeof arr2[index] === 'number') {
        return total + value * arr2[index];
      } else {
        console.error('Arrays must contain only numbers to calculate the product and sum.');
        return total;
      }
    }, 0);
  };

  const updateEstYearlyVaxAdmin = (value) => {
    const estYearlyVaxAdminResult = document.querySelector('[data-result="estYearlyVaxAdmin"]');
    if (estYearlyVaxAdminResult) {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue)) {
        estYearlyVaxAdminResult.textContent = "0";
      } else {
        const formattedValue = (parsedValue * 3850 / 2).toLocaleString('en-US');
        estYearlyVaxAdminResult.textContent = formattedValue;
      }
    } else {
      console.error("Element with data-result='estYearlyVaxAdmin' not found.");
    }
  };

  const toggleSection = (targetSection, selector) => {
    const simulationElements = document.querySelectorAll(selector);

    simulationElements.forEach((element) => {
      const section = element.getAttribute('data-simulation');
      if (section === targetSection) {
        element.classList.add('is-active');
      } else {
        element.classList.remove('is-active');
      }
    });
  };

  return {
    init,
  };
};

export default Simulator;

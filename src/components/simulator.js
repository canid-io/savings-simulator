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
        let typingTimeout;

        pediatricProvidersInput.addEventListener('input', (event) => {
          clearTimeout(typingTimeout);
          const newValue = event.target.value;

          typingTimeout = setTimeout(() => {
            updateEstYearlyVaxAdmin(newValue);
          }, 600);
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
        data.estYearlyVaxAdmin = data.pediatricProviders * 3850 / 2;

        // Money
        data.vaccineFees = data.estYearlyVaxAdmin * ( (100 - data.percentageVFC) / 100 ) * 100;
        data.adminFees = data.estYearlyVaxAdmin * (data.percentageVFC / 100) * 20 + data.estYearlyVaxAdmin * ( (100 - data.percentageVFC) / 100 ) * 35;
        data.vaccineWastage = data.vaccineFees * 0.02;
        data.paymentIssues =  (data.vaccineFees + data.adminFees) * 0.05;
        data.billingFeeCost = (data.billingFee !== "In-house" ? data.billingFee : 0) * (data.vaccineFees + data.adminFees);
        data.vaccineCosts = data.vaccineFees * 0.825;

        // Time
        data.purchasingVaccines = 0.5 * data.estYearlyVaxAdmin / 60;
        data.inventoryControl = 1 * data.estYearlyVaxAdmin / 60;
        data.reviewVaccinationHistory = 1 * data.estYearlyVaxAdmin / 60;
        data.ehrDataEntry = 3 * data.estYearlyVaxAdmin / 60;
        data.iisHandling = 0.5 * data.estYearlyVaxAdmin / 60;
        data.billsHandling = (data.billingFee !== "In-house" ? 0.5 : 5) * data.estYearlyVaxAdmin / 60;
        data.yearlyTimeExpenses = sumValues([data.purchasingVaccines, data.inventoryControl, data.reviewVaccinationHistory, data.ehrDataEntry, data.iisHandling, data.billsHandling]);

        // Total
        data.hoursSpentCost = sumProduct([data.purchasingVaccines, data.inventoryControl, data.reviewVaccinationHistory, data.ehrDataEntry, data.iisHandling, data.billsHandling], getItemCosts(data.vaccineManagement, false));
        data.totalVaxCost = sumValues([data.hoursSpentCost, data.vaccineWastage, data.paymentIssues, data.billingFeeCost, data.vaccineCosts]);
        data.totalRevenue = sumValues([-data.totalVaxCost, data.adminFees, data.vaccineFees]);
        data.totalRevenueWithCanid = data.adminFees;
        data.yearlySavings = data.totalRevenueWithCanid - data.totalRevenue;

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

  const hourlyCost = {
    Pediatrician: 150,
    "OM or Nurse": 50,
    "Admin Staff": 40,
  };

  const itemAssignments = {
    "Provider led": {
      "Purchasing and ordering vaccines": "Pediatrician",
      "Inventory monitoring and count": "Pediatrician",
      "Review vaccination history": "Pediatrician",
      "Vaccine data entry in EHR": "Pediatrician",
      "IIS uploads and issue handling": "Pediatrician",
      "Submitting bills & handling objections": "OM or Nurse",
    },
    "Office manager or staff led": {
      "Purchasing and ordering vaccines": "OM or Nurse",
      "Inventory monitoring and count": "OM or Nurse",
      "Review vaccination history": "Pediatrician",
      "Vaccine data entry in EHR": "OM or Nurse",
      "IIS uploads and issue handling": "OM or Nurse",
      "Submitting bills & handling objections": "Admin Staff",
    },
    Hybrid: {
      "Purchasing and ordering vaccines": "Pediatrician",
      "Inventory monitoring and count": "OM or Nurse",
      "Review vaccination history": "Pediatrician",
      "Vaccine data entry in EHR": "Pediatrician",
      "IIS uploads and issue handling": "OM or Nurse",
      "Submitting bills & handling objections": "Admin Staff",
    },
  };

  const getItemCosts = (managementType, includeItemNames = true) => {
    const assignments = itemAssignments[managementType];
    const itemCosts = [];

    for (const item in assignments) {
      const assignedPerson = assignments[item];
      const costPerPerson = hourlyCost[assignedPerson];
      if (includeItemNames) {
        itemCosts.push({ item, cost: costPerPerson });
      } else {
        itemCosts.push(costPerPerson);
      }
    }

    return itemCosts;
  };

  const displayResults = (data) => {
    const resultElements = document.querySelectorAll('[data-result]');

    resultElements.forEach((element) => {
      const key = element.getAttribute('data-result');

      if (key in data) {
        const value = data[key];
        if (typeof value === 'number' && !isNaN(value)) {
          element.textContent = Math.round(value).toLocaleString('en-US');
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

  const animateTyping = (element, text, speed) => {
    element.textContent = '';
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    typeWriter();
  };

  const updateEstYearlyVaxAdmin = (value) => {
    const estYearlyVaxAdminResult = document.querySelector('[data-result="estYearlyVaxAdmin"]');

    if (estYearlyVaxAdminResult) {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue)) {
        estYearlyVaxAdminResult.textContent = "0";
      } else {
        const calculatedValue = Math.round(parsedValue * 3850 / 2);
        const formattedValue = calculatedValue.toLocaleString('en-US');

        animateTyping(estYearlyVaxAdminResult, formattedValue, 50);
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

var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start: function () {
    console.log("MMM-DogeClock helper started...");
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_DOGE_DATA") {
      // Optionally pass targetDate in payload, else use default
      this.fetchDebtData(payload);
    }
  },

  fetchDebtData: async function (payload) {
    try {
      // Fetch national debt data
      const debtResponse = await fetch(
        'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&limit=1'
      );
      if (!debtResponse.ok) throw new Error('Debt API response not ok');
      const debtData = await debtResponse.json();
      const debt = parseFloat(debtData.data[0].tot_pub_debt_out_amt);

      // Fetch additional data concurrently
      const [savingsResponse, savingsPerTaxpayerResponse, totalInitiativesResponse] = await Promise.all([
        fetch('https://api.example.com/savings'),
        fetch('https://api.example.com/savings_per_taxpayer'),
        fetch('https://api.example.com/total_initiatives')
      ]);
      if (
        !savingsResponse.ok ||
        !savingsPerTaxpayerResponse.ok ||
        !totalInitiativesResponse.ok
      ) {
        throw new Error('One or more additional API responses not ok');
      }
      const savingsData = await savingsResponse.json();
      const savings = parseFloat(savingsData.value); // adjust field name as needed

      const savingsPerTaxpayerData = await savingsPerTaxpayerResponse.json();
      const savingsPerTaxpayer = parseFloat(savingsPerTaxpayerData.value); // adjust accordingly

      const totalInitiativesData = await totalInitiativesResponse.json();
      const totalInitiatives = parseInt(totalInitiativesData.value, 10); // adjust accordingly

      // Compute progress and countdownDays (use payload.targetDate if provided)
      const targetDate = payload && payload.targetDate ? payload.targetDate : "2026-07-04";
      const countdownDays = this.calculateDaysUntil(targetDate);
      const progressToGoal = (savings / 2000000000000) * 100;

      // Send the combined data to the module
      this.sendSocketNotification("DOGE_DATA", {
        debt,
        savings,
        savingsPerTaxpayer,
        totalInitiatives,
        progressToGoal,
        countdownDays
      });
    } catch (error) {
      console.error("MMM-DogeClock: Error fetching data", error);
    }
  },

  calculateDaysUntil: function(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  }
});

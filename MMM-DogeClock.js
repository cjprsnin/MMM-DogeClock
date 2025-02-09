Module.register("MMM-DogeClock", {
  defaults: {
    updateInterval: 60000,  // Update every minute
    targetDate: "2026-07-04"
  },

  start: function() {
    this.scheduleUpdate();
  },

  getStyles: function() {
    return ["MMM-DogeClock.css"];
  },

  scheduleUpdate: function() {
    this.fetchDebtData();
    setInterval(() => {
      this.fetchDebtData();
    }, this.config.updateInterval);
  },

  ffetchDebtData: async function() {
  try {
    // Fetch national debt data from the Treasury API
    const response = await fetch(
      'https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&limit=1'
    );
    if (!response.ok) throw new Error('Network response not ok');
    const data = await response.json();
    const debt = parseFloat(data.data[0].tot_pub_debt_out_amt);

    // Fetch additional data concurrently from their respective APIs
    const [
      savingsResponse,
      savingsPerTaxpayerResponse,
      totalInitiativesResponse
    ] = await Promise.all([
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
    const savings = parseFloat(savingsData.value); // Replace "value" with actual field name

    const savingsPerTaxpayerData = await savingsPerTaxpayerResponse.json();
    const savingsPerTaxpayer = parseFloat(savingsPerTaxpayerData.value); // Replace "value" as needed

    const totalInitiativesData = await totalInitiativesResponse.json();
    const totalInitiatives = parseInt(totalInitiativesData.value, 10); // Replace "value" accordingly

    // Calculate progress toward a $2T goal and days until the target date
    const progressToGoal = (savings / 2000000000000) * 100;
    const countdownDays = this.calculateDaysUntil(this.config.targetDate);

    // Update the display using all fetched data
    this.updateDebtDisplay({
      debt,
      savings,
      savingsPerTaxpayer,
      progressToGoal,
      totalInitiatives,
      countdownDays
    });
  } catch (error) {
    console.error('Error fetching debt data:', error);
  }
},


  calculateDaysUntil: function(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  },

  updateDebtDisplay: function({ debt, savings, savingsPerTaxpayer, progressToGoal, totalInitiatives, countdownDays }) {
    const wrapper = document.getElementById("us-debt-container");
    if (!wrapper) return;
    
    wrapper.innerHTML = `
      <div class="us-debt-container">
        <div class="us-debt">
          <div class="national-debt">DAYS UNTIL JULY 4, 2026</div>
          <div class="debt-amount">${countdownDays} Days</div>
        </div>
        <div class="us-debt">
          <div class="national-debt">NATIONAL DEBT</div>
          <div class="debt-amount">$${(debt / 1000000000000).toFixed(2)}T</div>
        </div>
        <div class="us-debt">
          <div class="national-debt">TAXPAYER DOLLARS SAVED</div>
          <div class="debt-amount">$${(savings / 1000000000).toFixed(2)}B</div>
        </div>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${progressToGoal.toFixed(2)}%;"></div>
      </div>
      <div class="progress-label">$0 → $1T → $2T</div>
    `;
  },

  getDom: function() {
    const wrapper = document.createElement("div");
    wrapper.id = "us-debt-container";
    return wrapper;
  }
});

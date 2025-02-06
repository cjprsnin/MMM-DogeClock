Module.register("MMM-DogeClock", {
    defaults: {
        updateInterval: 60000,  // Update every minute
        targetDate: "2026-07-04" // Goal date for countdown
    },

    start: function() {
        this.scheduleUpdate();
    },

    scheduleUpdate: function() {
        this.fetchDebtData();
        setInterval(() => {
            this.fetchDebtData();
        }, this.config.updateInterval);
    },

    fetchDebtData: async function() {
        try {
            const response = await fetch('https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny?sort=-record_date&limit=1');
            if (!response.ok) throw new Error('Network response not ok');
            const data = await response.json();
            const debt = parseFloat(data.data[0].tot_pub_debt_out_amt);
            
            // Simulated additional data (replace with real API calls if available)
            const savings = 2290000000; // Example: $2.29B
            const savingsPerTaxpayer = 15.24;
            const progressToGoal = 0.001; // 0.1% progress to $2T
            const totalInitiatives = 43;
            const countdownDays = this.calculateDaysUntil(this.config.targetDate);
            
            this.updateDebtDisplay({ debt, savings, savingsPerTaxpayer, progressToGoal, totalInitiatives, countdownDays });
        } catch (error) {
            console.error('Error fetching debt data:', error);
            const fallbackData = {
                debt: 34200000000000,
                savings: 2290000000,
                savingsPerTaxpayer: 15.24,
                progressToGoal: 0.001,
                totalInitiatives: 43,
                countdownDays: this.calculateDaysUntil(this.config.targetDate)
            };
            this.updateDebtDisplay(fallbackData);
        }
    },

    calculateDaysUntil: function(targetDate) {
        const today = new Date();
        const target = new Date(targetDate);
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },

    updateDebtDisplay: function({ debt, savings, savingsPerTaxpayer, progressToGoal, totalInitiatives, countdownDays }) {
        const wrapper = document.getElementById("debt-container");
        if (!wrapper) return;

        const progressPercent = (progressToGoal * 100).toFixed(2);

        wrapper.innerHTML = `
            <div class="tracker-container">
                <div class="tracker-header">${countdownDays} Days</div>
                <div class="tracker-subtitle">until July 4th, 2026</div>

                <div class="tracker-value">$${(savings / 1_000_000_000).toFixed(2)}B</div>
                <div class="tracker-label">Taxpayer Dollars Saved*</div>

                <table class="tracker-table">
                    <tr>
                        <td>Total Savings</td>
                        <td class="green">$${(savings / 1_000_000_000).toFixed(2)}B</td>
                    </tr>
                    <tr>
                        <td>Savings per Taxpayer</td>
                        <td class="green">$${savingsPerTaxpayer.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Progress to Goal</td>
                        <td>${progressPercent}%</td>
                    </tr>
                    <tr>
                        <td>Total Initiatives</td>
                        <td class="green">${totalInitiatives}</td>
                    </tr>
                </table>

                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                </div>
                <div class="progress-label">$0 → $1T → $2T</div>
            </div>
        `;
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.id = "debt-container";
        return wrapper;
    }
});

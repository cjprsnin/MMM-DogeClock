Module.register("MMM-DogeClock", {
    defaults: {
        updateInterval: 60000,  // Update every minute
        targetDate: "2026-07-04"
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
            
            // Example additional data (replace with real API calls if available)
            const savings = 2290000000; 
            const savingsPerTaxpayer = 15.24;
            const progressToGoal = (savings / 2000000000000) * 100; // Percentage toward $2T
            const totalInitiatives = 43;
            const countdownDays = this.calculateDaysUntil(this.config.targetDate);
            
            this.updateDebtDisplay({ debt, savings, savingsPerTaxpayer, progressToGoal, totalInitiatives, countdownDays });
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
            <!-- Header with Countdown and National Debt -->
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: bold;">
                    ${countdownDays} Days Until ${this.config.targetDate}
                </div>
                <div style="font-size: clamp(1.2rem, 3vw, 2rem);">
                    National Debt: $${(debt / 1000000000000).toFixed(2)}T
                </div>
            </div>

            <!-- Savings Details Container -->
            <div style="background-color: rgba(20, 20, 20, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: clamp(8px, 1.5vh, 15px); flex: 1 1 auto; min-height: 0px; display: flex; flex-direction: column;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: clamp(8px, 1.5vh, 15px); margin-bottom: clamp(8px, 1.5vh, 15px);">
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            <span>$${(savings / 1000000000).toFixed(2)}B</span>
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Total Savings
                        </div>
                    </div>
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            <span>$${savingsPerTaxpayer.toFixed(2)}</span>
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Savings per Taxpayer
                        </div>
                    </div>
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            ${progressToGoal.toFixed(2)}%
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Progress to Goal
                        </div>
                    </div>
                    <div>
                        <div style="color: rgb(74, 238, 74); font-size: clamp(0.9rem, 2.5vw, 1.3rem); font-weight: 500;">
                            ${totalInitiatives}
                        </div>
                        <div style="opacity: 0.7; font-size: clamp(0.7rem, 1.8vw, 0.9rem);">
                            Total Initiatives
                        </div>
                    </div>
                </div>
                <!-- Progress Bar -->
                <div style="width: 100%; position: relative; margin-top: auto;">
                    <div style="height: 4px; background-color: rgba(255, 255, 255, 0.2); border-radius: 2px; position: relative;">
                        <div style="height: 100%; width: ${progressToGoal.toFixed(2)}%; background-color: rgb(74, 238, 74); border-radius: 2px; transition: width 0.5s ease-out;"></div>
                        <div style="position: absolute; left: 50%; top: -4px; height: 12px; width: 2px; background-color: rgba(255, 255, 255, 0.4);"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px; opacity: 0.6; font-size: clamp(0.6rem, 1.5vw, 0.8rem);">
                        <span>$0</span>
                        <span>$1T</span>
                        <span>$2T</span>
                    </div>
                </div>
            </div>
        `;
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.id = "us-debt-container";
        return wrapper;
    }
});

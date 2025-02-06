Module.register("MMM-DogeClock", {
    defaults: {
        updateInterval: 60000,  // Update every minute
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
            
            // Update the debt display
            this.updateDebtDisplay(debt);
        } catch (error) {
            console.error('Error fetching debt data:', error);
            const fallbackDebt = 34200000000000;
            this.updateDebtDisplay(fallbackDebt);
        }
    },

    updateDebtDisplay: function(debt) {
        const formattedDebt = `$${Math.floor(debt).toLocaleString()}`;
        
        // Example of how you might update a specific element on your MagicMirror
        const debtElement = document.getElementById('debt-display');
        if (debtElement) {
            debtElement.textContent = formattedDebt;
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        const debtElement = document.createElement("div");
        debtElement.id = "debt-display";
        debtElement.classList.add("debt-display");
        wrapper.appendChild(debtElement);
        return wrapper;
    }
});

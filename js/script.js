// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacations-form');
    const resultsDiv = document.getElementById('results');
    const resetButton = document.getElementById('reset-button');

    // Fetch current dollar exchange rate from pydolarve.org API
    async function getDollarRate() {
        try {
            const response = await fetch('https://pydolarve.org/api/dolaroficial ');
            const data = await response.json();
            return data.venta; // Selling rate
        } catch (error) {
            console.error('Error fetching dollar rate:', error);
            return null;
        }
    }

    // Calculate vacations based on the entered salary
    function calculateVacations(salary) {
        const daysBase = 60;
        const daysSchoolSupplies = 30;
        const daysUniforms = 60;

        const totalDays = daysBase + daysSchoolSupplies + daysUniforms;
        const dailySalary = salary / 15; // Assuming 15 working days in a quincena

        const baseAmount = daysBase * dailySalary;
        const schoolSuppliesAmount = daysSchoolSupplies * dailySalary;
        const uniformsAmount = daysUniforms * dailySalary;

        return {
            baseAmount,
            schoolSuppliesAmount,
            uniformsAmount,
            totalAmount: baseAmount + schoolSuppliesAmount + uniformsAmount,
        };
    }

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const salaryInput = document.getElementById('salary');
        const salary = parseFloat(salaryInput.value);

        if (!isNaN(salary) && salary > 0) {
            const { baseAmount, schoolSuppliesAmount, uniformsAmount, totalAmount } = calculateVacations(salary);

            // Fetch dollar rates
            const dollarRateBCV = await getDollarRate(); // Dollar rate from pydolarve.org
            const dollarRatePatria = 50; // Fixed value as per requirements

            // Add dollar adjustments
            const totalWithAdjustments = totalAmount + dollarRateBCV + dollarRatePatria;

            // Display results
            resultsDiv.innerHTML = `
                <p><strong>Base (60 días):</strong> ${baseAmount.toFixed(2)}</p>
                <p><strong>Útiles Escolares (30 días):</strong> ${schoolSuppliesAmount.toFixed(2)}</p>
                <p><strong>Uniformes (60 días):</strong> ${uniformsAmount.toFixed(2)}</p>
                <hr>
                <p><strong>Total sin ajustes:</strong> ${totalAmount.toFixed(2)}</p>
                <p><strong>Ajuste por BCV ($40):</strong> ${dollarRateBCV.toFixed(2)}</p>
                <p><strong>Ajuste por Patria ($50):</strong> ${dollarRatePatria.toFixed(2)}</p>
                <hr>
                <p><strong>Total Final:</strong> ${totalWithAdjustments.toFixed(2)}</p>
            `;
        } else {
            alert('Por favor ingrese un salario válido.');
        }
    });

    // Reset form and results
    resetButton.addEventListener('click', () => {
        form.reset();
        resultsDiv.innerHTML = '';
    });
});

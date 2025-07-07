document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacations-form');
    const resultsDiv = document.getElementById('results');
    const resetButton = document.getElementById('reset-button');

    // ✅ Usamos una API actualizada y más confiable
    async function getDollarRate() {
        try {
            const response = await fetch('https://pydolarve.org/api/v1/bs_dolar ');
            const data = await response.json();

            // Convertimos el valor a número
            const dollarRateBCV = parseFloat(data.oficial);

            if (!isNaN(dollarRateBCV)) {
                return dollarRateBCV;
            } else {
                throw new Error("No se pudo obtener la cotización válida del dólar");
            }
        } catch (error) {
            console.error('Error obteniendo la cotización:', error);
            return null;
        }
    }

    function calculateVacations(salary) {
        const daysBase = 60;
        const daysSchoolSupplies = 30;
        const daysUniforms = 60;

        const totalDays = daysBase + daysSchoolSupplies + daysUniformes;
        const dailySalary = salary / 15;

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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const salaryInput = document.getElementById('salary');
        const salary = parseFloat(salaryInput.value);

        if (!isNaN(salary) && salary > 0) {
            const { baseAmount, schoolSuppliesAmount, uniformsAmount, totalAmount } = calculateVacations(salary);
            const dollarRateBCV = await getDollarRate(); // Obtener el valor del dólar

            let finalResult = `
                <p><strong>Base (60 días):</strong> ${baseAmount.toFixed(2)}</p>
                <p><strong>Útiles Escolares (30 días):</strong> ${schoolSuppliesAmount.toFixed(2)}</p>
                <p><strong>Uniformes (60 días):</strong> ${uniformsAmount.toFixed(2)}</p>
                <hr>
                <p><strong>Total sin ajustes:</strong> ${totalAmount.toFixed(2)}</p>
            `;

            if (dollarRateBCV !== null) {
                const bcvAdjustment = 40 * dollarRateBCV;
                const patriaAdjustment = 50 * dollarRateBCV;
                const totalWithAdjustments = totalAmount + bcvAdjustment + patriaAdjustment;

                finalResult += `
                    <p><strong>Ajuste BCV ($40):</strong> ${bcvAdjustment.toFixed(2)}</p>
                    <p><strong>Ajuste Patria ($50):</strong> ${patriaAdjustment.toFixed(2)}</p>
                    <hr>
                    <p><strong>Total Final:</strong> ${totalWithAdjustments.toFixed(2)}</p>
                `;
            } else {
                finalResult += `<p style="color:red;">⚠ No se pudo cargar la cotización del dólar.</p>`;
            }

            resultsDiv.innerHTML = finalResult;
        } else {
            alert('Por favor ingrese un salario válido.');
        }
    });

    resetButton.addEventListener('click', () => {
        form.reset();
        resultsDiv.innerHTML = '';
    });
});

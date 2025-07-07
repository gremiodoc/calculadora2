document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacations-form');
    const resultsDiv = document.getElementById('results');
    const resetButton = document.getElementById('reset-button');

    // Valor fijo del dólar en Bs.
    const dollarRateBCV = 110;

    // Cálculo de vacaciones
    function calculateVacations(salary) {
        const daysBase = 60;
        const daysSchoolSupplies = 30;
        const daysUniforms = 60;

        const dailySalary = salary / 15;

        return {
            baseAmount: daysBase * dailySalary,
            schoolSuppliesAmount: daysSchoolSupplies * dailySalary,
            uniformsAmount: daysUniforms * dailySalary,
        };
    }

    // Evento principal al enviar el formulario
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const salaryInput = document.getElementById('salary');
        const salary = parseFloat(salaryInput.value);

        if (!isNaN(salary) && salary > 0) {
            const { baseAmount, schoolSuppliesAmount, uniformsAmount } = calculateVacations(salary);

            const totalSinAjustes = baseAmount + schoolSuppliesAmount + uniformsAmount;
            const bcvAdjustment = 40 * dollarRateBCV; // Ajuste de $40
            const patriaAdjustment = 50 * dollarRateBCV; // Ajuste de $50
            const totalConAjustes = totalSinAjustes + bcvAdjustment + patriaAdjustment;

            let finalResult = `
                <p><strong>Base (60 días):</strong> ${baseAmount.toFixed(2)}</p>
                <p><strong>Útiles Escolares (30 días):</strong> ${schoolSuppliesAmount.toFixed(2)}</p>
                <p><strong>Uniformes (60 días):</strong> ${uniformsAmount.toFixed(2)}</p>
                <hr>
                <p><strong>Total sin ajustes:</strong> ${totalSinAjustes.toFixed(2)}</p>
                <p><strong>Ajuste BCV ($40):</strong> ${bcvAdjustment.toFixed(2)}</p>
                <p><strong>Ajuste Patria ($50):</strong> ${patriaAdjustment.toFixed(2)}</p>
                <hr>
                <p><strong>Total Final:</strong> ${totalConAjustes.toFixed(2)}</p>
            `;

            resultsDiv.innerHTML = finalResult;
        } else {
            alert('Por favor ingrese un salario válido.');
        }
    });

    // Reiniciar formulario
    resetButton.addEventListener('click', () => {
        form.reset();
        resultsDiv.innerHTML = '';
    });
});

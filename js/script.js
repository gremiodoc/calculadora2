document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('vacations-form');
    const resultsDiv = document.getElementById('results');
    const resetButton = document.getElementById('reset-button');

    // Función para obtener el dólar BCV con timeout
    async function getDollarRate() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

        try {
            const response = await fetch('https://pydolarve.org/api/v1/bs_dolar ', {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Error en la conexión con la API");

            const data = await response.json();

            const dollarRate = parseFloat(data.oficial.replace(',', '.'));

            if (isNaN(dollarRate)) {
                throw new Error("Valor del dólar no válido");
            }

            return dollarRate;

        } catch (error) {
            console.error("Error al obtener cotización:", error.message);
            return null;
        }
    }

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

    // Evento principal
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const salaryInput = document.getElementById('salary');
        const salary = parseFloat(salaryInput.value);

        if (!isNaN(salary) && salary > 0) {
            const { baseAmount, schoolSuppliesAmount, uniformsAmount } = calculateVacations(salary);
            const dollarRateBCV = await getDollarRate(); // Obtener valor del dólar

            let finalResult = `
                <p><strong>Base (60 días):</strong> ${baseAmount.toFixed(2)}</p>
                <p><strong>Útiles Escolares (30 días):</strong> ${schoolSuppliesAmount.toFixed(2)}</p>
                <p><strong>Uniformes (60 días):</strong> ${uniformsAmount.toFixed(2)}</p>
                <hr>
                <p><strong>Total sin ajustes:</strong> ${(baseAmount + schoolSuppliesAmount + uniformsAmount).toFixed(2)}</p>
            `;

            if (dollarRateBCV !== null) {
                const bcvAdjustment = 40 * dollarRateBCV;
                const patriaAdjustment = 50 * dollarRateBCV;
                const totalWithAdjustments = baseAmount + schoolSuppliesAmount + uniformsAmount + bcvAdjustment + patriaAdjustment;

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

    // Reiniciar formulario
    resetButton.addEventListener('click', () => {
        form.reset();
        resultsDiv.innerHTML = '';
    });
});

// Tax slab data for Bangladesh 2025-2026
const taxSlabs = {
    male: [
        { min: 0, max: 375000, rate: 0 },
        { min: 375000, max: 675000, rate: 0.10 },
        { min: 675000, max: 1075000, rate: 0.15 },
        { min: 1075000, max: 1575000, rate: 0.20 },
        { min: 1575000, max: 3575000, rate: 0.25 },
        { min: 3575000, max: Infinity, rate: 0.30 }
    ],
    female: [
        { min: 0, max: 425000, rate: 0 },
        { min: 425000, max: 725000, rate: 0.10 },
        { min: 725000, max: 1125000, rate: 0.15 },
        { min: 1125000, max: 1625000, rate: 0.20 },
        { min: 1625000, max: 3625000, rate: 0.25 },
        { min: 3625000, max: Infinity, rate: 0.30 }
    ],
    third_gender: [
        { min: 0, max: 500000, rate: 0 },
        { min: 500000, max: 675000, rate: 0.10 },
        { min: 675000, max: 1075000, rate: 0.15 },
        { min: 1075000, max: 1575000, rate: 0.20 },
        { min: 1575000, max: 3575000, rate: 0.25 },
        { min: 3575000, max: Infinity, rate: 0.30 }
    ],
    freedom_fighter: [
        { min: 0, max: 525000, rate: 0 },
        { min: 525000, max: 675000, rate: 0.10 },
        { min: 675000, max: 1075000, rate: 0.15 },
        { min: 1075000, max: 1575000, rate: 0.20 },
        { min: 1575000, max: 3575000, rate: 0.25 },
        { min: 3575000, max: Infinity, rate: 0.30 }
    ]
};

// Get DOM elements
const monthlySalaryInput = document.getElementById('monthlySalary');
const categorySelect = document.getElementById('category');
const calculateBtn = document.getElementById('calculateBtn');
const resultsSection = document.getElementById('results');
// Removed userInvestmentInput as it's replaced by multiple investment types
const checkInvestmentBtn = document.getElementById('checkInvestmentBtn');
const inputModeRadios = document.querySelectorAll('input[name="inputMode"]');
const monthlyInputDiv = document.getElementById('monthlyInput');
const manualInputDiv = document.getElementById('manualInput');
const monthlyInputs = document.querySelectorAll('.monthly-salary');
const investmentTypeCheckboxes = document.querySelectorAll('.investment-type');
const investmentAmountInputs = document.querySelectorAll('.investment-amount');

// Format currency
function formatCurrency(amount) {
    return '৳' + amount.toLocaleString('en-BD');
}

// Handle input mode change
inputModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'monthly') {
            monthlyInputDiv.style.display = 'block';
            manualInputDiv.style.display = 'none';
        } else {
            monthlyInputDiv.style.display = 'none';
            manualInputDiv.style.display = 'block';
        }
    });
});

// Update manual input summary
function updateManualSummary() {
    let total = 0;
    let count = 0;
    
    monthlyInputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        if (value > 0) {
            total += value;
            count++;
        }
    });
    
    const average = count > 0 ? total / count : 0;
    document.getElementById('avgMonthly').textContent = formatCurrency(average);
    document.getElementById('total12Months').textContent = formatCurrency(total);
}

// Add event listeners to manual inputs
monthlyInputs.forEach(input => {
    input.addEventListener('input', updateManualSummary);
});

// Handle investment type checkboxes
investmentTypeCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('change', (e) => {
        const amountInput = investmentAmountInputs[index];
        if (e.target.checked) {
            amountInput.disabled = false;
            amountInput.focus();
        } else {
            amountInput.disabled = true;
            amountInput.value = '';
        }
    });
});

// Calculate tax based on slabs
function calculateTax(income, category) {
    const slabs = taxSlabs[category];
    let tax = 0;
    let breakdown = [];
    
    for (let i = 0; i < slabs.length; i++) {
        const slab = slabs[i];
        if (income > slab.min) {
            const taxableInThisSlab = Math.min(income - slab.min, slab.max - slab.min);
            const taxForThisSlab = taxableInThisSlab * slab.rate;
            tax += taxForThisSlab;
            
            if (taxForThisSlab > 0) {
                breakdown.push({
                    range: `${formatCurrency(slab.min)} - ${slab.max === Infinity ? 'Above' : formatCurrency(slab.max)}`,
                    rate: `${slab.rate * 100}%`,
                    taxableAmount: formatCurrency(taxableInThisSlab),
                    tax: formatCurrency(taxForThisSlab),
                    rawTax: taxForThisSlab
                });
            }
        }
    }
    
    return { totalTax: tax, breakdown };
}

// Create comprehensive tax slab summary table
function createTaxSlabSummary(category, totalTaxableIncome) {
    const slabs = taxSlabs[category];
    const summaryDiv = document.getElementById('taxSlabSummary');
    
    let summaryHTML = `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300 rounded-lg">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Income Range</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Tax Rate</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Your Eligible Amount</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Tax on This Slab</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    slabs.forEach((slab, index) => {
        let eligibleAmount = 0;
        let taxOnSlab = 0;
        let status = '';
        let statusClass = '';
        
        if (totalTaxableIncome > slab.min) {
            eligibleAmount = Math.min(totalTaxableIncome - slab.min, slab.max - slab.min);
            taxOnSlab = eligibleAmount * slab.rate;
            status = eligibleAmount > 0 ? 'Applied' : 'Not Applied';
            statusClass = eligibleAmount > 0 ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50';
        } else {
            status = 'Not Reached';
            statusClass = 'text-gray-400 bg-gray-50';
        }
        
        const rangeText = slab.max === Infinity ? `${formatCurrency(slab.min)} and above` : `${formatCurrency(slab.min)} - ${formatCurrency(slab.max)}`;
        
        summaryHTML += `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="border border-gray-300 px-4 py-3">${rangeText}</td>
                <td class="border border-gray-300 px-4 py-3 font-semibold">${(slab.rate * 100).toFixed(0)}%</td>
                <td class="border border-gray-300 px-4 py-3 font-medium">${formatCurrency(eligibleAmount)}</td>
                <td class="border border-gray-300 px-4 py-3 font-medium text-purple-600">${formatCurrency(taxOnSlab)}</td>
                <td class="border border-gray-300 px-4 py-3">
                    <span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${status}</span>
                </td>
            </tr>
        `;
    });
    
    summaryHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    summaryDiv.innerHTML = summaryHTML;
}


// Main calculation function
function calculateTaxDetails() {
    const inputMode = document.querySelector('input[name="inputMode"]:checked').value;
    const category = categorySelect.value;
    let totalIncome;
    
    if (inputMode === 'monthly') {
        const monthlySalary = parseFloat(monthlySalaryInput.value);
        if (!monthlySalary || monthlySalary <= 0) {
            alert('Please enter a valid monthly salary');
            return;
        }
        // Calculate total income (13 months including 1 festival bonus)
        totalIncome = monthlySalary * 13;
    } else {
        let total12Months = 0;
        let hasInput = false;
        
        monthlyInputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            if (value > 0) hasInput = true;
            total12Months += value;
        });
        
        if (!hasInput) {
            alert('Please enter at least one month\'s salary');
            return;
        }
        
        // Add one month festival bonus (average of 12 months)
        const avgMonthly = total12Months / 12;
        totalIncome = total12Months + avgMonthly;
    }
    
    // Calculate taxable income (2/3 of total income)
    const taxableIncome = (totalIncome * 2) / 3;
    
    // Calculate tax
    const { totalTax, breakdown } = calculateTax(taxableIncome, category);
    
    // Calculate investment rebate (3% of taxable income, max 10 lac)
    const maxRebate = Math.min(taxableIncome * 0.03, 1000000);
    
    // Calculate minimum investment (amount whose 15% equals max rebate)
    const minInvestment = maxRebate / 0.15;
    
    // Calculate monthly TDS (Total Tax - Rebate) / 12
    const effectiveTax = Math.max(0, totalTax - maxRebate);
    const monthlyTDS = effectiveTax / 12;
    
    // Update UI
    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('taxableIncome').textContent = formatCurrency(taxableIncome);
    document.getElementById('totalTax').textContent = formatCurrency(totalTax);
    document.getElementById('monthlyTDS').textContent = formatCurrency(monthlyTDS);
    document.getElementById('maxRebate').textContent = formatCurrency(maxRebate);
    document.getElementById('minInvestment').textContent = formatCurrency(minInvestment);
    
    // Create comprehensive tax slab summary
    createTaxSlabSummary(category, taxableIncome);
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Store values for investment check
    window.currentMaxRebate = maxRebate;
}

// Check investment function with multiple types
function checkInvestment() {
    const investmentResult = document.getElementById('investmentResult');
    const maxRebate = window.currentMaxRebate;
    
    if (!maxRebate) {
        alert('Please calculate your tax first');
        return;
    }
    
    let totalInvestment = 0;
    let totalRebate = 0;
    let investmentDetails = [];
    let hasValidInvestment = false;
    
    // Process each investment type
    investmentTypeCheckboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const amountInput = investmentAmountInputs[index];
            const amount = parseFloat(amountInput.value) || 0;
            
            if (amount > 0) {
                hasValidInvestment = true;
                const rate = parseFloat(checkbox.dataset.rate);
                const rebate = amount * rate;
                const typeName = checkbox.nextElementSibling.textContent;
                
                totalInvestment += amount;
                totalRebate += rebate;
                
                investmentDetails.push({
                    type: typeName,
                    amount: amount,
                    rate: rate * 100,
                    rebate: rebate
                });
            }
        }
    });
    
    if (!hasValidInvestment) {
        alert('Please select at least one investment type and enter an amount');
        return;
    }
    
    // Cap the total rebate at maximum allowed
    const effectiveRebate = Math.min(totalRebate, maxRebate);
    const excessRebate = totalRebate - effectiveRebate;
    
    let resultHTML = `
        <div class="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i class="fas fa-chart-pie text-emerald-600 mr-2"></i>
                Investment Rebate Analysis
            </h4>
            
            <!-- Investment Breakdown -->
            <div class="mb-6">
                <h5 class="font-medium text-gray-700 mb-3">Your Investments:</h5>
                <div class="space-y-2">
    `;
    
    investmentDetails.forEach(detail => {
        resultHTML += `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span class="text-sm font-medium">${detail.type}</span>
                <div class="text-right">
                    <div class="text-sm text-gray-600">${formatCurrency(detail.amount)} × ${detail.rate}%</div>
                    <div class="font-semibold text-emerald-600">${formatCurrency(detail.rebate)}</div>
                </div>
            </div>
        `;
    });
    
    resultHTML += `
                </div>
            </div>
            
            <!-- Summary -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg">
                    <div class="text-sm text-blue-600 font-medium">Total Investment</div>
                    <div class="text-xl font-bold text-blue-800">${formatCurrency(totalInvestment)}</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg">
                    <div class="text-sm text-green-600 font-medium">Total Rebate</div>
                    <div class="text-xl font-bold text-green-800">${formatCurrency(totalRebate)}</div>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded-lg">
                    <div class="text-sm text-purple-600 font-medium">Effective Rebate</div>
                    <div class="text-xl font-bold text-purple-800">${formatCurrency(effectiveRebate)}</div>
                </div>
            </div>
    `;
    
    if (effectiveRebate >= maxRebate) {
        resultHTML += `
            <div class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-600 mr-3"></i>
                    <div>
                        <h6 class="font-semibold text-green-800">Excellent! Maximum Rebate Achieved</h6>
                        <p class="text-green-700 text-sm mt-1">
                            You've maximized your tax rebate at ${formatCurrency(maxRebate)}.
                            ${excessRebate > 0 ? `You have ${formatCurrency(excessRebate)} excess rebate that cannot be claimed this year.` : ''}
                        </p>
                    </div>
                </div>
            </div>
        `;
    } else {
        const shortfall = maxRebate - effectiveRebate;
        resultHTML += `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div class="flex items-center">
                    <i class="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
                    <div>
                        <h6 class="font-semibold text-yellow-800">Room for More Tax Savings</h6>
                        <p class="text-yellow-700 text-sm mt-1">
                            You can save an additional ${formatCurrency(shortfall)} in taxes. 
                            Consider investing more to maximize your rebate potential.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    resultHTML += '</div>';
    investmentResult.innerHTML = resultHTML;
    investmentResult.style.display = 'block';
}

// Event listeners
calculateBtn.addEventListener('click', calculateTaxDetails);
checkInvestmentBtn.addEventListener('click', checkInvestment);

// Allow Enter key to calculate
monthlySalaryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateTaxDetails();
    }
});

// Add Enter key support for investment amount inputs
investmentAmountInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkInvestment();
        }
    });
});
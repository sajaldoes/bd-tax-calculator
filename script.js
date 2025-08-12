// Tax slab data for Bangladesh
const taxSlabs = {
    '2025-26': {
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
    },
    '2024-25': {
        male: [
            { min: 0, max: 350000, rate: 0 },
            { min: 350000, max: 450000, rate: 0.05 },
            { min: 450000, max: 850000, rate: 0.10 },
            { min: 850000, max: 1350000, rate: 0.15 },
            { min: 1350000, max: 1850000, rate: 0.20 },
            { min: 1850000, max: 3850000, rate: 0.25 },
            { min: 3850000, max: Infinity, rate: 0.30 }
        ],
        female: [
            { min: 0, max: 400000, rate: 0 },
            { min: 400000, max: 500000, rate: 0.05 },
            { min: 500000, max: 900000, rate: 0.10 },
            { min: 900000, max: 1400000, rate: 0.15 },
            { min: 1400000, max: 1900000, rate: 0.20 },
            { min: 1900000, max: 3900000, rate: 0.25 },
            { min: 3900000, max: Infinity, rate: 0.30 }
        ],
        third_gender: [
            { min: 0, max: 475000, rate: 0 },
            { min: 475000, max: 575000, rate: 0.05 },
            { min: 575000, max: 975000, rate: 0.10 },
            { min: 975000, max: 1475000, rate: 0.15 },
            { min: 1475000, max: 1975000, rate: 0.20 },
            { min: 1975000, max: 3975000, rate: 0.25 },
            { min: 3975000, max: Infinity, rate: 0.30 }
        ],
        freedom_fighter: [
            { min: 0, max: 500000, rate: 0 },
            { min: 500000, max: 600000, rate: 0.05 },
            { min: 600000, max: 1000000, rate: 0.10 },
            { min: 1000000, max: 1500000, rate: 0.15 },
            { min: 1500000, max: 2000000, rate: 0.20 },
            { min: 2000000, max: 4000000, rate: 0.25 },
            { min: 4000000, max: Infinity, rate: 0.30 }
        ]
    }
};

// Get DOM elements
const monthlySalaryInput = document.getElementById('monthlySalary');
const categorySelect = document.getElementById('category');
const incomeYearSelect = document.getElementById('incomeYear');
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

// Format currency with universal taka icon
function formatCurrency(amount) {
    return `<span class="taka-symbol"><i class="fa-solid fa-bangladeshi-taka-sign taka-icon"></i>${amount.toLocaleString('en-US')}</span>`;
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

// Update year information text and manual month labels
function updateYearInfo() {
    const year = incomeYearSelect.value;
    const yearInfoText = document.getElementById('yearInfoText');
    
    if (year === '2025-26') {
        yearInfoText.textContent = 'Income Year: July 2025 - June 2026';
        updateManualMonthLabels(2025, 2026);
    } else if (year === '2024-25') {
        yearInfoText.textContent = 'Income Year: July 2024 - June 2025';
        updateManualMonthLabels(2024, 2025);
    }
}

// Update manual month labels based on income year
function updateManualMonthLabels(startYear, endYear) {
    const monthNames = [
        'July', 'August', 'September', 'October', 'November', 'December',
        'January', 'February', 'March', 'April', 'May', 'June'
    ];
    
    const monthlyInputs = document.querySelectorAll('.monthly-salary');
    monthlyInputs.forEach((input, index) => {
        const label = input.parentElement.querySelector('label');
        const isSecondHalf = index >= 6; // January to June are in the second half
        const year = isSecondHalf ? endYear : startYear;
        label.textContent = `${monthNames[index]} ${year}`;
    });
}

// Handle income year change
incomeYearSelect.addEventListener('change', updateYearInfo);

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
    document.getElementById('avgMonthly').innerHTML = formatCurrency(average);
    document.getElementById('total12Months').innerHTML = formatCurrency(total);
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
function calculateTax(income, category, year) {
    const slabs = taxSlabs[year][category];
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

// Create enhanced tax slab summary table with visuals
function createTaxSlabSummary(category, totalTaxableIncome, year, taxAfterMinimum = null) {
    const slabs = taxSlabs[year][category];
    const summaryDiv = document.getElementById('taxSlabSummary');
    
    // Get color for tax rate
    const getRateColor = (rate) => {
        if (rate === 0) return 'bg-gray-100 text-gray-700';
        if (rate <= 0.05) return 'bg-green-100 text-green-700';
        if (rate <= 0.15) return 'bg-blue-100 text-blue-700';
        if (rate <= 0.20) return 'bg-yellow-100 text-yellow-700';
        if (rate <= 0.25) return 'bg-orange-100 text-orange-700';
        return 'bg-red-100 text-red-700';
    };
    
    let summaryHTML = `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
                <thead>
                    <tr class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                        <th class="px-6 py-4 text-left font-semibold">Income Range</th>
                        <th class="px-6 py-4 text-center font-semibold">Tax Rate</th>
                        <th class="px-6 py-4 text-right font-semibold">Your Eligible Amount</th>
                        <th class="px-6 py-4 text-right font-semibold">Tax on This Slab</th>
                        <th class="px-6 py-4 text-center font-semibold">Status</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    slabs.forEach((slab, index) => {
        let eligibleAmount = 0;
        let taxOnSlab = 0;
        let status = '';
        let statusIcon = '';
        let statusClass = '';
        
        if (totalTaxableIncome > slab.min) {
            eligibleAmount = Math.min(totalTaxableIncome - slab.min, slab.max - slab.min);
            taxOnSlab = eligibleAmount * slab.rate;
            status = eligibleAmount > 0 ? 'Applied' : 'Not Applied';
            statusIcon = eligibleAmount > 0 ? 'fas fa-check-circle' : 'fas fa-minus-circle';
            statusClass = eligibleAmount > 0 ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-50';
        } else {
            status = 'Not Reached';
            statusIcon = 'fas fa-clock';
            statusClass = 'text-gray-400 bg-gray-50';
        }
        
        const rangeText = slab.max === Infinity ? `${formatCurrency(slab.min)} and above` : `${formatCurrency(slab.min)} - ${formatCurrency(slab.max)}`;
        const rateColor = getRateColor(slab.rate);
        const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
        
        summaryHTML += `
            <tr class="${rowBg} hover:bg-blue-50 transition-colors duration-200">
                <td class="px-6 py-4 font-medium text-gray-900">${rangeText}</td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${rateColor}">
                        ${(slab.rate * 100).toFixed(0)}%
                    </span>
                </td>
                <td class="px-6 py-4 text-right font-semibold text-gray-900">${formatCurrency(eligibleAmount)}</td>
                <td class="px-6 py-4 text-right font-bold text-purple-600">${formatCurrency(taxOnSlab)}</td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass}">
                        <i class="${statusIcon} mr-1"></i>
                        ${status}
                    </span>
                </td>
            </tr>
        `;
    });
    
    // Calculate total tax from slabs
    const calculatedTax = slabs.reduce((total, slab) => {
        if (totalTaxableIncome > slab.min) {
            const eligibleAmount = Math.min(totalTaxableIncome - slab.min, slab.max - slab.min);
            return total + (eligibleAmount * slab.rate);
        }
        return total;
    }, 0);
    
    // Use the tax after minimum if provided, otherwise use calculated tax
    const displayTax = taxAfterMinimum !== null ? taxAfterMinimum : calculatedTax;
    
    summaryHTML += `
                </tbody>
                <tfoot>
                    <tr class="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <td colspan="3" class="px-6 py-4 text-lg font-bold">
                            <i class="fas fa-calculator mr-2"></i>
                            Total Annual Tax (from tax slabs)
                        </td>
                        <td class="px-6 py-4 text-right text-xl font-bold">${formatCurrency(displayTax)}</td>
                        <td class="px-6 py-4 text-center">
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    summaryDiv.innerHTML = summaryHTML;
}


// Main calculation function
function calculateTaxDetails() {
    const inputMode = document.querySelector('input[name="inputMode"]:checked').value;
    const category = categorySelect.value;
    const year = incomeYearSelect.value;
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
    const { totalTax } = calculateTax(taxableIncome, category, year);
    
    // Apply minimum tax of 5000 if tax > 0
    const taxAfterMinimum = totalTax > 0 ? Math.max(5000, totalTax) : 0;
    
    // Calculate investment rebate - only if calculated tax is greater than 5000
    let maxRebate, minInvestment;
    if (totalTax > 5000) {
        maxRebate = Math.min(taxableIncome * 0.03, 1000000);
        minInvestment = maxRebate / 0.15;
    } else {
        // No rebate possible if calculated tax <= 5000
        maxRebate = 0;
        minInvestment = 0;
    }
    
    // Calculate effective tax after rebate
    let effectiveTax, actualRebateApplied = 0;
    if (totalTax > 5000 && maxRebate > 0) {
        effectiveTax = Math.max(5000, taxAfterMinimum - maxRebate);
        // Calculate actual rebate applied (difference between tax before and after rebate)
        actualRebateApplied = taxAfterMinimum - effectiveTax;
    } else {
        effectiveTax = taxAfterMinimum;
    }
    
    const monthlyTDS = effectiveTax / 12;
    
    // Update UI
    document.getElementById('totalIncome').innerHTML = formatCurrency(totalIncome);
    document.getElementById('taxableIncome').innerHTML = formatCurrency(taxableIncome);
    document.getElementById('totalTax').innerHTML = formatCurrency(taxAfterMinimum);
    document.getElementById('monthlyTDS').innerHTML = formatCurrency(monthlyTDS);
    document.getElementById('maxRebate').innerHTML = formatCurrency(maxRebate);
    document.getElementById('minInvestment').innerHTML = formatCurrency(minInvestment);
    
    // Update annual TDS tooltip with detailed rebate information
    let tooltipContent;
    if (actualRebateApplied > 0) {
        tooltipContent = `
            <div class="text-left">
                <div class="font-semibold mb-2">Annual TDS Breakdown:</div>
                <div class="space-y-1 text-sm">
                    <div>• Total Tax: ${formatCurrency(taxAfterMinimum)}</div>
                    <div>• Rebate Applied: ${formatCurrency(actualRebateApplied)}</div>
                    <div class="border-t border-gray-500 pt-1 mt-1">
                        <div class="font-medium">• Final TDS: ${formatCurrency(effectiveTax)}</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        tooltipContent = `Annual TDS: ${formatCurrency(effectiveTax)}`;
    }
    document.getElementById('annualTDSTooltip').innerHTML = tooltipContent;
    
    // Create comprehensive tax slab summary (show actual calculated tax, not minimum tax)
    createTaxSlabSummary(category, taxableIncome, year, totalTax);
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Store values for investment check
    window.currentMaxRebate = maxRebate;
    window.currentCalculatedTax = totalTax;
}

// Check investment function with multiple types
function checkInvestment() {
    const investmentResult = document.getElementById('investmentResult');
    const maxRebate = window.currentMaxRebate;
    const calculatedTax = window.currentCalculatedTax;
    
    if (maxRebate === undefined) {
        alert('Please calculate your tax first');
        return;
    }
    
    if (calculatedTax <= 5000) {
        investmentResult.innerHTML = `
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div class="flex items-center">
                    <i class="fas fa-info-circle text-yellow-600 mr-3"></i>
                    <div>
                        <h6 class="font-semibold text-yellow-800">No Investment Rebate Applicable</h6>
                        <p class="text-yellow-700 text-sm mt-1">
                            Your calculated tax (${formatCurrency(calculatedTax)}) is subject to minimum tax rule. 
                            Investment rebates only apply when calculated tax exceeds 5,000 BDT.
                        </p>
                    </div>
                </div>
            </div>
        `;
        investmentResult.style.display = 'block';
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

// Load cached salary from localStorage
function loadCachedSalary() {
    const cachedSalary = localStorage.getItem('monthlySalary');
    if (cachedSalary && cachedSalary !== '50000') {
        monthlySalaryInput.value = cachedSalary;
    }
}

// Save salary to localStorage
function saveSalary() {
    const salary = monthlySalaryInput.value;
    if (salary) {
        localStorage.setItem('monthlySalary', salary);
    }
}

// Add event listener to save salary when it changes
monthlySalaryInput.addEventListener('blur', saveSalary);
monthlySalaryInput.addEventListener('input', saveSalary);

// Initialize manual month labels on page load
document.addEventListener('DOMContentLoaded', () => {
    updateYearInfo();
    loadCachedSalary();
});
const MoveService = require("../services/MoveService");
// Date-fns
const es = require("date-fns/locale/es")

/**
 * 
 * @param {*} user 
 * @param {*} initDate 
 * @param {*} endDate 
 */
async function getBalance(user, initDate, endDate) {
    var balance = {incomes: 0, expenses: 0, balance: 0};
    const results = await MoveService.findAmountSumBetweenDatesGroupedByType(user, initDate, endDate);

    results.forEach((result) => {
        if (result._id.type == "income") {
            balance.incomes = result.total;
        } else if (result._id.type == "expense") {
            balance.expenses = result.total;
        }
    });

    balance.balance = balance.incomes-balance.expenses;

    return balance;
}

/**
 * 
 * @param {*} user 
 * @param {*} initDate 
 * @param {*} endDate 
 */
async function getExpensesCategoryChartPie(user, initDate, endDate) {
    var data = [];
    var colors = [];
    var labels = [];
    var legends = [];
    const movesAggregation = await MoveService.findAmountSumBetweenDatesAndTypeGroupedByCategory(user, "expense", initDate, endDate);

    movesAggregation.forEach((move) => {
        data.push(move.total);
        colors.push(move.category[0].color);
        labels.push(move.category[0].name);

        legends.push({
            label: move.category[0].name,
            backgroundColor: move.category[0].color
        });
    });

    var data = {
        datasets: [{
            data: data,
            backgroundColor: colors
        }],
        labels: labels
    };

    return {data: data, legends: legends};
}


/**
 * 
 * @param {*} user 
 * @param {*} initDate 
 * @param {*} endDate 
 */
async function getExpensesCategoryChartPiev2(user, initDate, endDate) {
    return await MoveService.findAmountSumBetweenDatesAndTypeGroupedByCategory(user, "expense", initDate, endDate);
}

/**
 * 
 * @param {*} user 
 */
async function getMonthlyBalanceChart(user, initDate, endDate) {
    const incomesAggregation = await MoveService.findAmountSumBetweenDatesAndTypeGroupedByMonth(user, "income", initDate, endDate);
    const expensesAggregation = await MoveService.findAmountSumBetweenDatesAndTypeGroupedByMonth(user, "expense", initDate, endDate);

    var incomes = Array(12).fill(0);
    var expenses = Array(12).fill(0);
    var savings = Array(12).fill(0);
    var labels = [];
    for (i = 0; i < 12; i++) { 
        labels.push( es.localize.month(i, { width: 'abbreviated' }) )
    }

    incomesAggregation.forEach((income) => { incomes[income._id.month-1] = income.total; });
    expensesAggregation.forEach((expense) => { expenses[expense._id.month-1] = -expense.total; });
    for (var i = 0; i < incomes.length; i++) { savings[i] = incomes[i] + expenses[i]; }

    var data = {
        datasets: [{
            type: 'line',
            label: "Balance",
            data: savings,
            borderColor: "#5a67d8",
            backgroundColor: "#5a67d8",
            pointBackgroundColor: "#5a67d8",
            pointBorderColor: "#5a67d8",
            borderWidth: 2,
            fill: false
        },
        {
            type: 'bar',
            label: "Ingresos",
            data: incomes,
            backgroundColor: "#48bb78"
        },
        {
            type: 'bar',
            label: "Gastos",
            data: expenses,
            backgroundColor: "#f56565"
        }],
        labels: Array.from(labels)
    };

    let legends = [];
    data.datasets.forEach((data) => {
        legends.push({
            label: data.label,
            backgroundColor: data.backgroundColor,
        });
    });

    return {data: data, legends: legends};
}

async function getMonthlyBalanceChartv2(user, initDate, endDate) {
    const incomesAggregation = await MoveService.findAmountSumBetweenDatesAndTypeGroupedByMonth(user, "income", initDate, endDate);
    const expensesAggregation = await MoveService.findAmountSumBetweenDatesAndTypeGroupedByMonth(user, "expense", initDate, endDate);

    var incomes = Array(12).fill(0);
    var expenses = Array(12).fill(0);
    var savings = Array(12).fill(0);

    incomesAggregation.forEach((income) => { incomes[income._id.month-1] = income.total; });
    expensesAggregation.forEach((expense) => { expenses[expense._id.month-1] = -expense.total; });
    for (var i = 0; i < incomes.length; i++) { savings[i] = incomes[i] + expenses[i]; }

    return { incomes: incomes, expenses: expenses, balances: savings };
}

module.exports =
    { 
        getBalance,
        getExpensesCategoryChartPie,
        getExpensesCategoryChartPiev2,
        getMonthlyBalanceChart,
        getMonthlyBalanceChartv2
    };
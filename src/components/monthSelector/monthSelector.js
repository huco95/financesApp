import Modal from "bootstrap/js/dist/modal";
import state from "../../state";
import stats from "../stats/stats";
import moves from "../moves/moves";
import { parse, startOfMonth, endOfMonth } from 'date-fns';

const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const monthsLong = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const yearSelectedElement = document.getElementById("yearSelected");
var monthSelectorModal;
var monthSelected;
var year;

function initialize() {
    monthSelected = new Date().getMonth();
    year = new Date().getFullYear();
    
    document.getElementById("monthDiv").innerHTML = monthsLong[monthSelected];
    document.getElementById("yearDiv").innerHTML = year;

    yearSelectedElement.innerText = year;

    monthSelectorModal = new Modal(document.getElementById("monthSelectorModal"), {});
    document.getElementById("monthSelector").addEventListener("click", () => {
        monthSelectorModal.show();
    });

    generateMonths();
    initalizeMonthsContainerButtons();
    initalizeYearsContainerButtons();
}

function updateDisplay() {
    var month = monthSelected + 1;
    var newDate = parse(year + "-" + (month), "yyyy-MM", new Date());
    state.updateInitDate(startOfMonth(newDate));
    state.updateEndDate(endOfMonth(newDate));

    stats.render();
    moves.render();

    document.getElementById("monthDiv").innerHTML = monthsLong[monthSelected];
    document.getElementById("yearDiv").innerHTML = year;
    monthSelectorModal.hide();
}

function generateMonths() {
    months.forEach((month, i) => {
        document.getElementById("monthsContainer").appendChild(generateMonthElement(month, i));
    });
}

function generateMonthElement(monthName, monthIndex) {
    var monthDiv = document.createElement("div");
    monthDiv.innerText = monthName;
    monthDiv.id = "month-" + monthIndex;
    monthDiv.dataset.month = monthIndex;
    if (monthIndex == monthSelected) {
        monthDiv.classList.add("month-selected");
    }

    monthDiv.addEventListener("click", (event) => { monthOnClickEvent(event); });

    return monthDiv;
}

function monthOnClickEvent(event) {
    const selectedMonthNode = document.getElementById("month-" + monthSelected);
    if (selectedMonthNode != undefined) {
        selectedMonthNode.classList.remove("month-selected");
    }
    event.target.classList.add("month-selected");
    monthSelected = parseInt(event.target.dataset.month);

    updateDisplay();
}

function initalizeMonthsContainerButtons() {
    document.getElementById("prevYear").addEventListener("click", () => {
        yearSelectedElement.innerText = --year;
    });

    document.getElementById("nextYear").addEventListener("click", () => {
        yearSelectedElement.innerText = ++year;
    });

    yearSelectedElement.addEventListener("click", () => {
        generateYears();
    });
}

// -------------------------- Years --------------------------
const yearsContainer = document.getElementById("yearsContainer");

function generateYears() {
    yearsContainer.innerHTML = "";

    var decade = parseInt(year.toString().slice(-1));
    var startingYear = (year - decade) - 1;
    var endYear = startingYear + 12;

    document.getElementById("yearsRange").innerText = parseInt(startingYear) + "-" + (parseInt(endYear) - 1);

    for (var y = startingYear; y < endYear; y++) {
        yearsContainer.appendChild(generateYearElement(y));
    }

    showYearsSection();
}

function generateYearElement(y) {
    var yearSelectedElement = document.createElement("div");
    yearSelectedElement.innerText = y;
    yearSelectedElement.id = "year-" + y;
    yearSelectedElement.dataset.year = y;
    if (y == year) { yearSelectedElement.classList.add("month-selected"); }

    yearSelectedElement.addEventListener("click", (event) => { yearOnClickEvent(event); });

    return yearSelectedElement;
}

function yearOnClickEvent(event) {
    year = event.target.dataset.year;
    yearSelectedElement.innerText = year;
    showMonthsSection();
}

function initalizeYearsContainerButtons() {
    document.getElementById("prevDecadeBtn").addEventListener("click", () => {
        year -= 10;
        generateYears();
    });

    document.getElementById("nextDecadeBtn").addEventListener("click", () => {
        year += 10;
        generateYears()
    });
}

// -------------------------- Common --------------------------
function showYearsSection() {
    yearsContainer.classList.remove("hidden");
    document.getElementById("navYears").classList.remove("hidden");
    document.getElementById("monthsContainer").classList.add("hidden");
    document.getElementById("navYear").classList.add("hidden");
}

function showMonthsSection() {
    yearsContainer.classList.add("hidden");
    document.getElementById("navYears").classList.add("hidden");
    document.getElementById("monthsContainer").classList.remove("hidden");
    document.getElementById("navYear").classList.remove("hidden");
}

export default { initialize };
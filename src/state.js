import { startOfMonth, endOfMonth, getTime } from 'date-fns';
import { es } from 'date-fns/locale';

var initDate = startOfMonth(new Date());
var endDate = endOfMonth(new Date());

function getInitDate() {
    return initDate;
}

function updateInitDate(newInitDate) {
    initDate = newInitDate;
}

function getInitDateMiliseconds() {
    return getTime(initDate);
}

function getEndDate() {
    return endDate;
}

function updateEndDate(newEndDate) {
    endDate = newEndDate;
}

function getEndDateMiliseconds() {
    return getTime(endDate);
}

function getLocale() {
    return es;
}

export default { getInitDate, updateInitDate, getInitDateMiliseconds, getEndDate, updateEndDate, getEndDateMiliseconds, getLocale };
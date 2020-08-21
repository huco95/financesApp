import totalStats from "./totalStats";
import monthChart from "./monthChart";
import categoryChart from "./categoryChart";

function render() {
    totalStats.render();
    monthChart.render();
    categoryChart.render();
}

export default { render };
import Dropdown from "bootstrap/js/dist/dropdown";
import monthSelector from "./components/monthSelector/monthSelector";
import stats from "./components/stats/stats";
import moves from "./components/moves/moves";
import sw from "./serviceWorker/register"

sw.register();

window.onload = () => {
    monthSelector.initialize();

    stats.render();
    moves.initialize();
    moves.render();
}
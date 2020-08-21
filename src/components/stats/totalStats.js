import state from "../../state";

function render() {
  const totalsDiv = document.getElementById("totalsDiv");
  var request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
      if (request.status == 200) {
        totalsDiv.innerHTML = request.response;
      } else { console.log("ERROR"); }
    }
  };

  request.open("get", "/incomesExpensesStats?initDate=" + state.getInitDateMiliseconds() + "&endDate=" + state.getEndDateMiliseconds(), true);
  request.send();
}

export default { render };
import Chart from "chart.js";

const monthsChartCtx = document.getElementById("monthsChart").getContext('2d');
var monthsChart;

function render() {
    var request = new XMLHttpRequest();
  
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (request.status == 200) {
          // Destroy if chart is already created
          if (monthsChart != undefined) { monthsChart.destroy(); }
          
          var response = JSON.parse(request.response);
          var chartData = response.chart;
          chartData.options = {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            scales: {
              xAxes: [{ stacked: true }],
              yAxes: [{ stacked: true }]
            },
            legend: {
              display: false           
            },
            animation: {
              animateScale: true,
              animateRotate: true
            },
            tooltips: {
              enabled: true,
              position: "average",
              mode: 'index',
              intersect: false
            }
          };
  
          // Destroy chart and create the new one
          if (monthsChart != undefined) { monthsChart.destroy(); }
          monthsChart = new Chart(monthsChartCtx, chartData);
  
          document.getElementById("monthsChartDivLegend").innerHTML = response.lengedsHtml;
  
        } else { console.log("ERROR"); }
      }
    };
  
    request.open("get", "/monthsChart", true);
    request.send();
}

export default { render };
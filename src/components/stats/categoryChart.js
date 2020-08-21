import state from "../../state";
import Chart from "chart.js";

const categoryChartCtx = document.getElementById("categroyChartPie").getContext('2d');
var categoryChart;

function render() {
    var request = new XMLHttpRequest();
  
    request.onreadystatechange = () => {
      if (request.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
        if (request.status == 200) {
          var response = JSON.parse(request.response);
          var chartData = response.chart;
  
          chartData.options = {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            cutoutPercentage: 75,
            legend: {
              display: false,
              labels: {
                generateLabels: (chart) => {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const meta = chart.getDatasetMeta(0);
                      const style = meta.controller.getStyle(i);
  
                      return {
                        text: label + " [" + data.datasets[0].data[i] + "]",
                        fillStyle: style.backgroundColor,
                        strokeStyle: style.borderColor,
                        lineWidth: style.borderWidth,
                        hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
  
                        // Extra data used for toggling the correct item
                        index: i
                      };
                    });
                  }
                  return [];
                }
              }
            },
            animation: {
              animateScale: true,
              animateRotate: true
            }
          };
  
          // Destroy chart and create the new one
          if (categoryChart != undefined) { categoryChart.destroy(); }
          categoryChart = new Chart(categoryChartCtx, chartData);
  
          document.getElementById("categroyChartPieLegend").innerHTML = response.lengedsHtml;
  
        } else { console.log("ERROR"); }
      }
    };
  
    request.open("get", "/categoryChartPie?initDate=" + state.getInitDateMiliseconds() + "&endDate=" + state.getEndDateMiliseconds(), true);
    request.send();
}
  
export default { render };
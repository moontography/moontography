import Chart from "chart.js";
import dayjs from "dayjs";

export const headerChart = {
  createChart(chartId, chartData) {
    let chartColor = "#FFFFFF";
    const ctx = document.getElementById(chartId).getContext("2d");
    let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, "#80b6f4");
    gradientStroke.addColorStop(1, chartColor);

    let gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.map((d) => {
          return dayjs(d[0]).format("MMM DD");
        }),
        datasets: [
          {
            label: "Data",
            borderColor: chartColor,
            backgroundColor: gradientFill,
            pointBorderColor: chartColor,
            pointBackgroundColor: "#1e3d60",
            pointHoverBackgroundColor: "#1e3d60",
            pointHoverBorderColor: chartColor,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            borderWidth: 2,
            data: chartData.map((d) => d[1]),
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 0,
            bottom: 0,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "#fff",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
        },
        legend: {
          position: "bottom",
          fillStyle: "#FFF",
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(255,255,255,0.4)",
                fontStyle: "bold",
                beginAtZero: true,
                maxTicksLimit: 5,
                padding: 10,
              },
              gridLines: {
                drawTicks: true,
                drawBorder: false,
                display: true,
                color: "rgba(255,255,255,0.1)",
                zeroLineColor: "transparent",
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                zeroLineColor: "transparent",
                display: false,
              },
              ticks: {
                padding: 10,
                fontColor: "rgba(255,255,255,0.4)",
                fontStyle: "bold",
              },
            },
          ],
        },
      },
    });
  },
};

export default headerChart;

import { hexToRGB } from "./utils";
import Chart from "chart.js";

export const barChart1 = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#2CA8FF";
    const title = "Active Countries";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: this.title || "",
            borderColor: color,
            pointBorderColor: "#FFF",
            pointBackgroundColor: color,
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: [80, 99, 86, 96, 123, 85, 100, 75, 88, 90, 123, 155],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          bodySpacing: 4,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
        },
        responsive: 1,
        scales: {
          yAxes: [
            {
              gridLines: {
                zeroLineColor: "transparent",
                drawBorder: false,
              },
            },
          ],
          xAxes: [
            {
              display: 0,
              ticks: {
                display: false,
              },
              gridLines: {
                zeroLineColor: "transparent",
                drawTicks: false,
                display: false,
                drawBorder: false,
              },
            },
          ],
        },
        layout: {
          padding: { left: 0, right: 0, top: 15, bottom: 15 },
        },
      },
    });
  },
};

export const barChart2 = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#2CA8FF";
    const title = "Active Countries";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            backgroundColor: "#f96332",
            data: [40, 26, 28, 45, 20, 25, 30, 25, 20, 25, 20, 15],
          },
          {
            backgroundColor: "#2CA8FF",
            data: [15, 20, 25, 30, 25, 20, 15, 20, 25, 30, 25, 20],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          bodySpacing: 4,
          mode: "nearest",
          intersect: 0,
          position: "nearest",
          xPadding: 10,
          yPadding: 10,
          caretPadding: 10,
        },
        responsive: 1,
        scales: {
          yAxes: [
            {
              gridLines: {
                zeroLineColor: "transparent",
                drawBorder: false,
              },
            },
          ],
          xAxes: [
            {
              display: 0,
              ticks: {
                display: false,
              },
              gridLines: {
                zeroLineColor: "transparent",
                drawTicks: false,
                display: false,
                drawBorder: false,
              },
            },
          ],
        },
        layout: {
          padding: { left: 0, right: 0, top: 15, bottom: 15 },
        },
      },
    });
  },
};

const funcs = {
  barChart1() {},
  barChart2() {},
};

export default funcs;

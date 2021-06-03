import { hexToRGB } from "./utils";
import Chart from "chart.js";

export const activeUsersChart = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#f96332";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
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
            data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630],
          },
        ],
      },
      options: {
        responsive: true,
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
        scales: {
          yAxes: [
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

export const emailsCampaignChart = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#18ce0f";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"],
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
            data: [40, 500, 650, 700, 1200, 1250, 1300, 1900],
          },
        ],
      },
      options: {
        responsive: true,
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
        scales: {
          yAxes: [
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

export const activeCountriesChart = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#2CA8FF";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "line",
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
            data: [80, 78, 86, 96, 83, 85, 76, 75, 88, 90],
          },
        ],
      },
      options: {
        responsive: true,
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
        scales: {
          yAxes: [
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

export const lineChart1 = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#f96332";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
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
            data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630],
          },
        ],
      },
      options: {
        responsive: true,
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
        scales: {
          yAxes: [
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

export const lineChart2 = {
  createChart(chartId) {
    const chartColor = "#FFFFFF";
    const fallBackColor = "#18ce0f";
    const color = this.color || fallBackColor;
    const ctx = document.getElementById(chartId).getContext("2d");
    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(1, chartColor);

    const gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB(color, 0.4));

    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"],
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
            data: [40, 500, 650, 700, 1200, 1250, 1300, 1900],
          },
        ],
      },
      options: {
        responsive: true,
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
  activeUsersChart() {},
  emailsCampaignChart() {},
  activeCountriesChart() {},
  lineChart1() {},
  lineChart2() {},
};

export default funcs;

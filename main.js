import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

class IncidentChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.chart = null;
  }

  async onCustomWidgetAfterUpdate(changedProperties) {
    // Fetch data from SAC
    const data = await this.getData();

    if (!data || !data.resultSet) {
      this.shadowRoot.innerHTML = "<p>No data available</p>";
      return;
    }

    // Process data: grouping by STATUS (dimension 0) and counting PRIORITY (dimension 1)
    const rows = data.resultSet.data; // array of rows

    // Prepare labels and counts
    const counts = {};
    const labels = [];

    for (const row of rows) {
      const status = row.dimensions[0].member;
      if (!counts[status]) {
        counts[status] = 0;
        labels.push(status);
      }
      counts[status]++;
    }

    const chartLabels = labels;
    const chartData = labels.map(label => counts[label]);

    // Render chart
    if (!this.chart) {
      this.shadowRoot.innerHTML = `<canvas id="myChart" width="400" height="300"></canvas>`;
      const ctx = this.shadowRoot.getElementById("myChart").getContext("2d");

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: chartLabels,
          datasets: [{
            label: "Incident Count by Status",
            data: chartData,
            backgroundColor: "rgba(54, 162, 235, 0.7)"
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } else {
      this.chart.data.labels = chartLabels;
      this.chart.data.datasets[0].data = chartData;
      this.chart.update();
    }
  }
}

customElements.define("incident-chart", IncidentChart);

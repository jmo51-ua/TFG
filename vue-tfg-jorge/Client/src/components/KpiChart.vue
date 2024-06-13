<template>
  <div class="chart-container">
    <canvas :id="chartId"></canvas>
  </div>
</template>


<script>
import Chart from 'chart.js/auto';

export default {
  name: 'KpiChart',
  props: {
    chartData: {
      type: Array,
      required: true
    },
    chartId: {
      type: String,
      required: true
    },
    chartName: {
      type: String,
      required: true
    }
  },
  mounted() {
    const ctx = document.getElementById(this.chartId);
    if (this.chartData && this.chartData.length > 0) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.chartData.map(row => row.time),
          datasets: [
            {
              label: this.chartName,
              data: this.chartData.map(row => row.score)
            }
          ]
        }
      });
    } else {
      console.error('No chart data available');
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: auto;
}
</style>
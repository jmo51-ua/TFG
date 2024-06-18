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

    try{
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
          },
          options: {
            animation: {
              duration: 1500, // milisegundos
              easing: 'easeOutCubic', // Tipo de animación
              onProgress(animation) {
                const chartInstance = animation.chart;
                const ctx = chartInstance.ctx;
                const dataset = chartInstance.data.datasets[0];
                const meta = chartInstance.getDatasetMeta(0);
                meta.data.forEach((bar, index) => {
                  const data = dataset.data[index];
                  ctx.fillText(data, bar.x, bar.y - 5);
                });
              },
              onComplete(animation) {
                const chartInstance = animation.chart;
                const ctx = chartInstance.ctx;
                const dataset = chartInstance.data.datasets[0];
                const meta = chartInstance.getDatasetMeta(0);
                meta.data.forEach((bar, index) => {
                  const data = dataset.data[index];
                  ctx.fillText(data, bar.x, bar.y - 5);
                });
              }
            },
          }
        });
      } else {
        console.error('No chart data available');
      }
    }
    catch(error){
      console.error("Error:",error)
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
<template>
  <div class="chart-container">
    <bar-chart :chart-data="chartData" :options="chartOptions"></bar-chart>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'KpiChart',
  components: {
    BarChart: Bar
  },
  props: {
    kpis: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Puntuación',
            backgroundColor: '#42A5F5',
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  watch: {
    kpis: {
      immediate: true,
      handler(newKpis) {
        this.updateChart(newKpis);
      }
    }
  },
  methods: {
    updateChart(kpis) {
      if (!kpis || kpis.length === 0) {
        this.chartData.labels = [];
        this.chartData.datasets[0].data = [];
        return;
      }

      this.chartData.labels = kpis.map(kpi => kpi.ses_name);
      this.chartData.datasets[0].data = kpis.map(kpi => parseFloat(kpi.score));
    }
  }
};
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
  height: 40vh;
  width: 80vw;
}
</style>

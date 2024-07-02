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
    },
    isHomeView: {
      type: Boolean,
      default: false
    },
  },
  mounted() {
    try {
      const ctx = document.getElementById(this.chartId);
      if (this.chartData && this.chartData.length > 0) {
        const options = {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1500,
            easing: 'easeOutCubic',
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
          }
        };

        if (this.isHomeView) {
          options.scales = {
            x: {
              ticks: {
                maxRotation: 5,
                minRotation: 5,
                autoSkip: false,
                callback: function(value) {
                  const label = this.getLabelForValue(value);
                  const words = label.split(' ');
                  if (words.length === 2) {
                    let truncatedLabel
                    truncatedLabel = words[0].slice(0, 3) + ' '+words[1].slice(0, 4);
                    
                    return truncatedLabel;
                  }
                  return label.length > 4 ? label.slice(0, 4) + '...' : label;
                }
              }
            }
          };
        }else{
          options.scales = {
            x: {
              ticks: {
                maxRotation: 5,
                minRotation: 5,
                autoSkip: false,
                callback: function(value) {
                  const label = this.getLabelForValue(value);
                  const words = label.split(' ');
                  if (words.length === 2) {
                    let truncatedLabel
                    truncatedLabel = words[0].slice(0, 6) + '. '+words[1].slice(0, 4)+ '.';
                    
                    return truncatedLabel;
                  }
                  return label.length > 6 ? label.slice(0, 6) + '.' : label;
                }
              }
            }
          };
        }

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
          options
        });
      } else {
        console.error('No hay datos para la grafica');
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
</script>


<style scoped>
  .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
</style>

import { useState, useEffect } from "react";
import { renderToString } from 'react-dom/server'

import ReactApexChart from "react-apexcharts";

const TokenTotalPie = (props) => {

  const { chartData } = props;

  // const series = [44, 55, 41, 17, 15];
  
  const totals = chartData.map(function(item) {
    return Number(item['total']);
  });
  const names = chartData.map(function(item) {
    return item['name'];
  });
  const prices = chartData.map(function(item) {
    return Number(item['prices']);
  });

  const options = {
    plotOptions: {
      // pie: {
      //   donut: {
      //     labels: {
      //       show: true,
      //       name: {
      //         formatter: function (val) {
      //           return val
      //         },        
      //       },
      //       value: {
      //         formatter: function (val) {
      //           return val
      //         },        
      //       },
      //       total: {
      //         show: true,
      //         label: 'Total',
      //         fontSize: '22px',
      //         fontWeight: 600,
      //         formatter: function (w) {
      //           return w.globals.seriesTotals.reduce((a, b) => {
      //             return a + b
      //           }, 0)
      //         }
      //       }
      //     }
      //   }
      // }
    },
    chart: {
      type: 'donut',
      sparkline: {
        enabled: true,
      },    
      legend: {
        show: false,
      },  
    },
    stroke: {
      show: false
    },
    labels: names,
    dataLabels: {
      enabled: true,
      formatter: (val, opt) => {
        if (opt.seriesIndex >= 0) {
          return names[opt.seriesIndex]
        }
      },
    },
    legend: {
      show: false,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      enabled: true,
      shared: false,
      theme: 'dark',
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return renderToString(
          <div className="py-2 px-4">
            <p>
              Token: <b>{names[seriesIndex] || ''}</b>
            </p>
            <p>
              Quantity: <b>{totals[seriesIndex] || ''}</b>
            </p>
            <p>
              Value: <b>€{prices[seriesIndex] || ''}</b>
            </p>
          </div>
        )
    },
},
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={prices}
        labels={names}
        type="donut"
        height="300px"
      />
    </div>
  );
}

export default TokenTotalPie;
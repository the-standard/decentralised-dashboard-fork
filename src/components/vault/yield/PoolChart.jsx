import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import moment from 'moment';

import {
  useLocalThemeModeStore,
} from "../../../store/Store";

// const YieldPoolChart = ({ hypervisorData, yieldPair }) => {
const YieldPoolChart = ({ hypervisorData, yieldPair }) => {
  const { localThemeModeStore } = useLocalThemeModeStore();
  const isLight = localThemeModeStore && localThemeModeStore.includes('light');

  let series = [];
  let xAxis = [];
  if (hypervisorData && hypervisorData.length) {
    series = [
      {
        name: 'Position',
        data: hypervisorData?.map(item => item.period_gamma_netApr)
      },
      {
        name: `If Held ${yieldPair[0] || ''}`,
        data: hypervisorData?.map(item => item.period_hodl_token0)
      },
      {
        name: `If Held ${yieldPair[1] || ''}`,
        data: hypervisorData?.map(item => item.period_hodl_token1)
      },
    ];

    xAxis = hypervisorData?.map((item) => {
      // const formattedDate = moment.unix(Number(item.timestamp)).format('MMM DD');
      return item.timestamp;
    });
  }

  const dataColors = [
    '#facc15',
    '#22d3ee',
    '#a855f7',
  ];

  return (
    <div id="chart">
      <ReactApexChart
        options={{
          chart: {
            type: "line",
            zoom: {
              enabled: false,
            },
            foreColor: isLight ? ('#000') : ('#fff'),
            toolbar: {
              show: false
            },
          },
          dataLabels: {
            enabled: false,
          },
          colors: dataColors,
          fill: {
            type: "none",
            opacity: 0,
          },
          stroke: {
            curve: "straight",
            width: 2,
          },
          grid: {
            show: false,
          },
          yaxis: {
            show: true,
            forceNiceScale: true,
            labels: {
              show: true,
              formatter: function (value) {
                const useVal = value.toFixed(2);
                return useVal + '%'
              },  
            },
          },
          xaxis: {
            categories: xAxis,
            tooltip: {
              enabled: false,
            },
            axisTicks: {
              show: false,
            },
            tickAmount: 4,
            labels: {
              formatter: function (value) {
                const useDate = moment.unix(value).format('MMM DD');
                return useDate
              },
            }
          },
          tooltip: {
            enabled: true,
            followCursor: true,
            shared: true,
            theme: isLight ? ('light') : ('dark'),
            x: {
              show: true,
              formatter: function (value, { w }) {
                const useDate = moment.unix(xAxis[value - 1]).format('Do MMM YYYY');
                return useDate
              },
            },
            y: {
              formatter: function (val) {
                if (val >= 0) {
                  return ('+' + val.toFixed(3) + '%');
                } else {
                  return (val.toFixed(3) + '%');
                }
              },
            },
          },
        }}
        series={series}
        type="area"
      />
    </div>
  );
};

export default YieldPoolChart;
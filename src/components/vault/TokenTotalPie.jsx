
import { useState, useEffect } from "react";
import { renderToString } from 'react-dom/server'

import ReactApexChart from "react-apexcharts";

import {
  useYieldBalancesStore,
} from "../../store/Store";

import Typography from "../../components/ui/Typography";

const TokenTotalPie = (props) => {

  const { chartData, vaultId, vaultVersion, vaultType } = props;

  const { yieldBalances } = useYieldBalancesStore();

  // const series = [44, 55, 41, 17, 15];

  let currencySymbol = '';
  if (vaultType === 'EUROs') {
    currencySymbol = '€';
  }
  if (vaultType === 'USDs') {
    currencySymbol = '$';
  }
  
  const totals = chartData.map(function(item) {
    return Number(item['total']);
  });
  const names = chartData.map(function(item) {
    return item['name'];
  });
  const prices = chartData.map(function(item) {
    return Number(item['prices']);
  });

  let yieldTotals = [];
  let yieldNames = [];
  let yieldPrices = [];
  if (yieldBalances && yieldBalances.length) {
    yieldTotals = yieldBalances.map(function(item) {
      return Number(0);
    });
    yieldNames = yieldBalances.map(function(item) {
      return item['pair'];
    });
    yieldPrices = yieldBalances.map(function(item) {
      return Number(item['balance']);
    });  
  }

  const useTotals = [...totals, ...yieldTotals];
  const useNames = [...names, ...yieldNames];
  const usePrices = [...prices, ...yieldPrices];

  let useSeries = usePrices;

  let chartEmpty = false;

  if (useSeries.some(el => el > 0)) {
    chartEmpty = false;
  } else {
    chartEmpty = true;
    useSeries = [1];
  }


  const options = {
    chart: {
      type: 'donut',
      sparkline: {
        enabled: true,
      },    
      legend: {
        show: false,
      },  
    },
    plotOptions: {
      pie: {
        expandOnClick: chartEmpty ? (false) : (false),
        donut: {
          size: '70%',
        }
      }
    },
    stroke: {
      show: chartEmpty ? (false) : (true),
      curve: 'straight',
      lineCap: 'round',
      colors: ['rgba(255,255,255,0.2'],
      width: 1,
      dashArray: 0, 
    },
    labels: useNames,
    dataLabels: {
      enabled: chartEmpty ? (false) : (true),
      formatter: (val, opt) => {
        if (opt.seriesIndex >= 0) {
          return useNames[opt.seriesIndex]
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
      enabled: chartEmpty ? (false) : (true),
      shared: false,
      theme: 'dark',
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        return renderToString(
          <div className="py-2 px-4">
            <p>
              Token: <b>{useNames[seriesIndex] || ''}</b>
            </p>
            {/* <p>
              Quantity: <b>{useTotals[seriesIndex] || ''}</b>
            </p> */}
            <p>
              Value: <b>{currencySymbol}{usePrices[seriesIndex] || ''}</b>
            </p>
          </div>
        )
      },
    },
    states: {
      active: {
        filter: {
          type: chartEmpty ? ('none') : ('darken')
        }
      },
      hover: {
        filter: {
          type: chartEmpty ? ('none') : ('lighten')
        }
      },
    },
    colors: chartEmpty ? (
      ['rgba(0,0,0,0.3)']
    ) : (
      [
        'rgba(0, 143, 251, 1)',
        'rgba(139, 77, 249, 1)',
        'rgba(248, 226, 35, 1)',
        'rgba(0, 227, 150, 1)',
        'rgba(233, 30, 99, 1)',
        'rgba(0, 143, 251, 1)',
        'rgba(0, 227, 150, 1)',
        'rgba(206, 212, 220, 1)',
      ]
    ),
  };

  return (
    <div id="chart" className="relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Typography
          variant="h3"
          className="text-center"
        >
          Vault ID<br/>
          {vaultVersion ? (
            `V${vaultVersion}-`
          ) : ('')}
          {vaultId}
        </Typography>
      </div>
      <div
        className={`relative tst-pie ${chartEmpty ? ' empty' : ''}`}
      >
        {chartEmpty ? (null) : (
          <div className="tst-pie-overlay"></div>
        )}
        <ReactApexChart
          options={options}
          series={useSeries || []}
          labels={names || []}
          type="donut"
          height="200px"
          width="200px"
        />
      </div>
    </div>
  );
}

export default TokenTotalPie;
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import moment from 'moment';

const ValueChart = ({ chartData }) => {
  const [useSeries, setUseSeries] = useState([]);

  useEffect(() => {
    const useData = [];
    chartData.forEach((snapshot) => {
      snapshot.assets.forEach((asset) => {
        const timestamp = moment(snapshot.snapshot_at).unix() || '';
        if (!useData.find(section => section.name === asset[0])) {
          useData.push({name: asset[0], data: []});
        }
        useData.find(section => section.name === asset[0]).data.push([
          timestamp, asset[2], asset[1]
        ]);
      });
    });
    setUseSeries(useData);
  }, [chartData]);

  const colours = ['#8b4df9', '#f8e223', '#008FFB', '#00E396', '#e91e63', '#008FFB', '#00E396', '#CED4DC'];

  return (
    <div>
      <ReactApexChart
        options={{
          chart: {
            type: "area",
            stacked: true,
            foreColor: 'rgba(255,255,255,0.8)',
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
          },
          noData: {
            text: 'No Data',
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: -20,
            style: {
              color: 'white',
              fontSize: '14px',
              // fontFamily: undefined
            }
          },
          dataLabels: {
            enabled: false,
          },
          title: {
            // text: "Total Value (USD)",  
            align: "left",
            style: {
              color: "#fff",
              fontFamily: "Poppins",
              fontWeight: 300,
            },
          },
          colors: colours,
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              inverseColors: false,
              opacityFrom: 0.5,
              opacityTo: 0,
              stops: [0, 90, 100],
            },
          },
          grid: {
            show: false,
            padding: {
              left: -10,
            }
          },
          yaxis: {
            show: true,
            labels: {
              show: true,
              offsetX: -15,
            },
          },
          stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            colors: undefined,
            width: 2,
            dashArray: 0,
          },
          xaxis: {
            type: "category",
            labels: {
              show: true,
              formatter: function(value) {
                return (
                  moment.unix(Number(value)).format('DD MMM')
                );
              }
            },
            axisBorder: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
          },
          tooltip: {
            enabled: true,
            shared: true,
            theme: 'dark',
            x: {
              show: false,
              // formatter: function (
              //   value,
              //   {
              //     seriesIndex, w
              //   }
              // ) {
              //   const title = w.config.series[seriesIndex].name || '' || value;
              //   return (
              //     title
              //   );
              // }
            },
            y: {
              title: {
                formatter: (value) =>  {
                  return (
                    `${value} (USD): `
                  )
                }
              },
              // title: {
              //   formatter: () =>  {
              //     return (
              //       'Value (USD): '
              //     )
              //   }
              // },
              formatter: function (value) {
                return `$${value.toString()}`;
              },
            },
            z: {
              title: '',
              formatter: function () {
                return '';
              },
            },
          },
        }}
        series={useSeries}
        type="area"
        // height={chartHeight}
        // width={chartWidth}
      />
    </div>
  );
};

export default ValueChart;

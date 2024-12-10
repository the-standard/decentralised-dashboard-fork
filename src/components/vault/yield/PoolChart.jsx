import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

const YieldPoolChart = ({ data, symbol }) => {
  const [chartWidth, setChartWidth] = useState(200);
  const [chartHeight, setChartHeight] = useState(60);
  const [lineColor, setLineColor] = useState("green");

  let convertedData = [];
  if (data && data.length) {
    convertedData = data.map(({ ts, price }) => [ts * 1000, price]);
  }

  const series = [
    {
      name: symbol,
      data: convertedData,
    },
  ];

  function formatNumber(value) {
    const formattedValue = (value / 100).toString();
    const indexOfDot = formattedValue.length - 2;
    const finalValue =
      formattedValue.slice(0, indexOfDot) + formattedValue.slice(indexOfDot);

    return finalValue;
  }

  const renderColor = () => {
    if (convertedData && convertedData.length) {
      if (
        Number(convertedData[convertedData.length - 1][1]) >
        Number(convertedData[0][1])
      ) {
        setLineColor("green");
      } else if (
        Number(convertedData[convertedData.length - 1][1]) <
        Number(convertedData[0][1])
      ) {
        setLineColor("red");
      }  
    }
  };

  useEffect(() => {
    renderColor();
  }, [convertedData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 900px)").matches) {
        setChartWidth(120);
        // setChartHeight(60);
      } else if (window.matchMedia("(max-width: 1400px)").matches) {
        setChartWidth(120);
        // setChartHeight(80);
      } else {
        setChartWidth(150);
        // setChartHeight(80);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize); 
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div id="chart">
      <ReactApexChart
        options={{
          chart: {
            type: "area",
            stacked: false,
            sparkline: {
              enabled: true,
            },    
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
            }
          },
          dataLabels: {
            enabled: false,
          },
          colors: [lineColor],
          fill: {
            type: "gradient",
            opacity: 1,
            gradient: {
              shadeIntensity: 1,
              type: "vertical",
              colorStops: [
                {
                  offset: 0,
                  color: lineColor,
                  opacity: 0.3,
                },
                {
                  offset: 100,
                  color: lineColor,
                  opacity: 0,
                },
              ],
            },
          },
          grid: {
            show: false,
          },
          yaxis: {
            show: true,
            // forceNiceScale: true,
            labels: {
              show: false,
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
            type: "datetime",
            labels: {
              show: false,
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
            shared: false,
            theme: 'dark',
            x: {
              show: false,
              formatter: (value) => {
                const lang = navigator?.language || 'en-US';
                return new Date(value).toLocaleString(lang, {dateStyle: 'short', timeStyle: 'short'});
              }
            },
            y: {
              formatter: function (val) {
                const dollarSign = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(0)[0];
                return dollarSign + formatNumber((val / 1000000).toFixed(0));
              },
            },
          },
        }}
        series={series}
        type="area"
        height={chartHeight}
        width={chartWidth}
      />
    </div>
  );
};

export default YieldPoolChart;
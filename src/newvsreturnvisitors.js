import * as echarts from "echarts";
import React, { useEffect, useRef } from "react";
// import useComponentSize from "@rehooks/component-size";

const Newvsresturnvisitors = (props) => {
  console.log("yc ", props);

  var option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    yAxis: {
      type: "value"
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      {
        data: [100, 200, 300, 400, 500, 600, 700],
        type: "line"
      }
    ]
  };

  const chart = useRef(null);
  let chartInstance = null;
  // const size = useComponentSize(chart);

  function renderChart() {
    const renderInstance = echarts.getInstanceByDom(chart.current);

    if (renderInstance) {
      chartInstance = renderInstance;
    } else {
      chartInstance = echarts.init(chart.current);
      // chartInstance.resize();
    }
    chartInstance.setOption(option);
  }

  useEffect(() => {
    renderChart();
  });

  // const tempStype = {
  //   width: "100%",
  //   height: "100%",
  //   background: "red"
  // };

  return (
    <div
      ref={chart}
      // style={{
      //   width: "100%",
      //   height: "100%",
      //   background: "white"
      // }}

      style={{
        props
      }}
    />
  );
};

export default Newvsresturnvisitors;

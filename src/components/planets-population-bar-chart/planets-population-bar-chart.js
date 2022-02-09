import { useEffect, useState } from "react";
const axios = require("axios");

function getWithUrlRoot(urlRoot) {
  return axios.get("https://swapi.py4e.com/api/" + urlRoot);
}

async function getWithFullUrlAsync(urlFull) {
  return await axios.get(urlFull);
}

function getData() {
  return getWithUrlRoot("planets")
    .then(function (planets) {
      console.log("planets", planets.data.results);
      let filteredAndMappedPlanets = planets.data.results
        .filter((planet) =>
          ["Tatooine", "Alderaan", "Naboo", "Bespin", "Endor"].some(
            (name) => planet.name === name
          )
        )
        .map(({ name, population }) => ({ name, population }));

      return filteredAndMappedPlanets;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

const PlanetsPopulationBarChart = (props) => {
    let [res, setRes] = useState();
  
    useEffect(() => {
      getData().then(function (data) {
        console.log(data);
        setRes(data);
      });
    }, []);
    return <BarChart data={res} />
  };

const Chart = ({ children, width, height }) => (
  <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
    {children}
  </svg>
);

const Bar = ({ x, y, width, height }) => (
  <rect x={x} y={y} width={width} height={height} fill={"#0ac"} />
);

const BarChart = ({ data }) => {
  //   // Width of each bar
  //   const itemWidth = 20;

  //   // Distance between each bar
  //   const itemMargin = 5;

  //   const dataLength = data.length;

  //   // Normalize data, we'll reduce all sizes to 25% of their original value
  //   const massagedData = data.map((datum) =>
  //     Object.assign({}, datum, { repos: datum.repos * 0.25 })
  //   );

  //   const mostRepos = massagedData.reduce((acc, cur) => {
  //     const { repos } = cur;
  //     return repos > acc ? repos : acc;
  //   }, 0);

  //   const chartHeight = mostRepos;

  return <span>{data && data[0].name}</span>;
  //   return (
  //     <Chart
  //       width={dataLength * (itemWidth + itemMargin)}
  //       height={chartHeight}
  //     >
  //       {massagedData.map((datum, index) => {
  //         const itemHeight = datum.repos;

  //         return (
  //           <Bar
  //             key={datum.name}
  //             x={index * (itemWidth + itemMargin)}
  //             y={chartHeight - itemHeight}
  //             width={itemWidth}
  //             height={itemHeight}
  //           />
  //         );
  //       })}
  //     </Chart>
  //   );
};

export default PlanetsPopulationBarChart;

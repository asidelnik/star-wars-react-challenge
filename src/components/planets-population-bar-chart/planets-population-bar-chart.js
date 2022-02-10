import { useEffect, useState } from "react";
const axios = require("axios");

function getWithUrlRoot(urlRoot) {
  return axios.get("https://swapi.py4e.com/api/" + urlRoot);
}

function getData() {
  return getWithUrlRoot("planets")
    .then(function (planets) {
      // console.log("planets", planets.data.results);
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
      // console.log(data);
      setRes(data);
    });
  }, []);
  return <BarChart data={res} />;
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
  if (data) {
    data.sort((a, b) => b.population - a.population);
    // Width of each bar
    const itemWidth = 150;

    // Distance between each bar
    const itemMargin = 5;

    const dataLength = data.length;

    const massagedData = data.map((datum) =>
      Object.assign({}, datum, { population: datum.population * 0.00000007 })
    );

    const mostPopulation = massagedData.reduce((acc, cur) => {
      const { population } = cur;
      return population > acc ? population : acc;
    }, 0);
    const chartHeight = mostPopulation;

    return (
      <Chart width={dataLength * (itemWidth + itemMargin)} height={chartHeight + 80}>
        {data.map((datum, index) => {
          const itemHeight = datum.population * 0.00000007;
          const name = datum.name;

          return [
            <text
              key={"population_" + datum.name}
              fill="black"
              fontSize="16"
              fontFamily="Roboto"
              x={index * (itemWidth + itemMargin)}
              y={chartHeight - itemHeight + 20}
            >
              {datum.population}
            </text>,
            <Bar
              key={"bar_" + datum.name}
              x={index * (itemWidth + itemMargin)}
              y={chartHeight - itemHeight + 40}
              width={itemWidth}
              height={itemHeight}
            />,
            <text
              key={"planet_" + datum.name}
              fill="black"
              fontSize="16"
              fontFamily="Roboto"
              x={index * (itemWidth + itemMargin)}
              y={chartHeight + 70}
            >
              {name}
            </text>,
          ];
        })}
      </Chart>
    );
  } else {
    return <span>No data!</span>;
  }
};

export default PlanetsPopulationBarChart;
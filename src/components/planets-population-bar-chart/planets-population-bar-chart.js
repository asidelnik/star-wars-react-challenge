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
  return <span>x</span>;
};

export default PlanetsPopulationBarChart;

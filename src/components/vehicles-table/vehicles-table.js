import { getDefaultNormalizer, logDOM } from "@testing-library/react";
import { useEffect, useState } from "react";

const axios = require("axios");

function getWithUrlRoot(urlRoot) {
  // axios.get('https://swapi.py4e.com/api/planets/3/')
  return axios.get("https://swapi.py4e.com/api/" + urlRoot);
}

function getWithFullUrl(urlFull) {
  return axios.get(urlFull);
}

function getData() {
  return getWithUrlRoot("vehicles")
    .then(function (response) {
      console.log("vehicles", response.data.results);
      let vehiclesWithPilots = response.data.results.filter(
        (v) => v.pilots.length > 0
      );
      console.log("vehiclesWithPilots", vehiclesWithPilots);

      let pilotUrls = vehiclesWithPilots.map((v) => v.pilots).flat();
      return pilotUrls;
    })
    .then(function (pilotsUrls) {
      console.log(pilotsUrls)
      let pilots = pilotsUrls.map((p) => getWithFullUrl(p));
      return Promise.allSettled(pilots)
    })
    .then(function (pilots) {
      console.log("pilots", pilots)
      let homeWorlds = pilots.map((p) => getWithFullUrl(p.value.data.homeworld));
      return Promise.allSettled(homeWorlds)
    })
    .then(function (homeWorlds) {
      console.log("homeWorlds", homeWorlds)
      let homeWorldsSortedDesc = 
        homeWorlds.map((p) => p.value.data)
        .map(({population, url}) => ({population, url}))
        .sort((a, b) => b.population - a.population);
      console.log("homeWorldsSortedDesc", homeWorldsSortedDesc);

      return Promise.allSettled(homeWorlds)
    })

    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

const VehiclesTable = (props) => {
  const [res, setRes] = useState()

  useEffect(() => {
    const fn = async () => {
      const data = await getData();
      console.log({data})

    }
    fn()
  }, [])
  // let res = undefined;
  // res = getData();

  return (
    <table id="vehicle-table">
      <tbody>
        <tr>
          <td>
            Vehicle name with the largest diameter sum {res && res.data.climate}
          </td>
        </tr>
        <tr>
          <td>
            Related home planets and their respective diameter{" "}
            {res && res.data.diameter}
          </td>
        </tr>
        <tr>
          <td>Related pilot names {res && res.data.name}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default VehiclesTable;

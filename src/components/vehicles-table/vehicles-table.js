import { useEffect, useState } from "react";
import bold from './styles.css';

const axios = require("axios");

function getWithUrlRoot(urlRoot) {
  return axios.get("https://swapi.py4e.com/api/" + urlRoot);
}

async function getWithFullUrlAsync(urlFull) {
  return await axios.get(urlFull);
}

function getData() {
  return getWithUrlRoot("vehicles")
    .then(function (vehicles) {
      console.log("vehicles", vehicles.data.results);
      let vehiclesWhichHavePilots = vehicles.data.results.filter(
        (v) => v.pilots.length > 0
      );
      console.log("vehiclesWithPilots", vehiclesWhichHavePilots);
      let vehicleAndPilotsUrls = vehiclesWhichHavePilots.map(
        ({ pilots, url, name }) => ({ pilots, url, name })
      );
      return vehicleAndPilotsUrls;
    })
    .then(function (vehicleAndPilotsUrls) {
      console.log("vehicleAndPilotsUrl", vehicleAndPilotsUrls);
      let vehiclesAndPilots = vehicleAndPilotsUrls.map(async (vehicle) => {
        let promisesInner = vehicle.pilots.map((p) => getWithFullUrlAsync(p));
        vehicle.pilots = await Promise.allSettled(promisesInner);
        return vehicle;
      });
      console.log(vehiclesAndPilots);
      return Promise.allSettled(vehiclesAndPilots);
    })
    .then(function (vehiclesAndPilots_AllKeys) {
      console.log("response", vehiclesAndPilots_AllKeys);
      let vehicleAndPilots_SpecificKeys = [];
      for (let vehicle of vehiclesAndPilots_AllKeys) {
        vehicleAndPilots_SpecificKeys.push({
          vehicleUrl: vehicle.value.url,
          vehicleName: vehicle.value.name,
          pilots: vehicle.value.pilots
            .map((p) => p.value.data)
            .map(({ name, homeworld }) => ({ name, homeworld })),
        });
      }
      console.log("response", vehicleAndPilots_SpecificKeys);
      return vehicleAndPilots_SpecificKeys;
    })
    .then(function (vehicleAndPilots_SpecificKeys) {
      console.log("response", vehicleAndPilots_SpecificKeys);
      let vehiclesPilotsWorlds = vehicleAndPilots_SpecificKeys.map(
        async (vehicle) => {
          for (let pilot of vehicle.pilots) {
            pilot.homeworldData = await getWithFullUrlAsync(pilot.homeworld);
          }
          return vehicle;
        }
      );
      console.log("response", vehiclesPilotsWorlds);
      return Promise.allSettled(vehiclesPilotsWorlds);
    })
    .then(function (vehiclesPilotsWorlds) {
      console.log("homeworlds", vehiclesPilotsWorlds);
      let vehiclesPilotsWorlds_SpecificKeys = [];
      for (let vehicle of vehiclesPilotsWorlds) {
        vehiclesPilotsWorlds_SpecificKeys.push({
          vehicleUrl: vehicle.value.vehicleUrl,
          vehicleName: vehicle.value.vehicleName,
          pilots: vehicle.value.pilots.map(function (p) {
            return {
              pilotName: p.name,
              homeworld: p.homeworld,
              homeworldName: p.homeworldData.data.name,
              homeworldPopulation: isNaN(
                parseInt(p.homeworldData.data.population)
              )
                ? 0
                : parseInt(p.homeworldData.data.population),
            };
          }),
          vehicleTotalPopulation: vehicle.value.pilots.reduce((acc, cur) => {
            let homeworldPopulation = isNaN(
              parseInt(cur.homeworldData.data.population)
            )
              ? 0
              : parseInt(cur.homeworldData.data.population);
            return (acc += homeworldPopulation);
          }, 0),
        });
      }
      vehiclesPilotsWorlds_SpecificKeys.sort(
        (a, b) => b.vehicleTotalPopulation - a.vehicleTotalPopulation
      );
      let vehicleWithLargestPopulationSum =
        vehiclesPilotsWorlds_SpecificKeys[0];
      console.log("response", vehicleWithLargestPopulationSum);
      return vehicleWithLargestPopulationSum;
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

const VehiclesTable = (props) => {
  let [res, setRes] = useState();

  useEffect(() => {
    getData().then(function (data) {
      console.log(data);
      setRes(data);
    });
  }, []);

  return (
    <table id="vehicle-table">
      <tbody>
        <tr>
          <td>
            Vehicle name with the largest population sum:
            <span className="bold"> {res && res.vehicleName}</span>
          </td>
        </tr>
        <tr>
          <td>
            Related home planets and their respective population
            <ul>
              {res &&
                res.pilots.map((pilot) => {
                  const { homeworldName, homeworldPopulation } = pilot;
                  return (
                    <li key={homeworldName}>
                      <span className="bold">{homeworldName} - {homeworldPopulation}</span>
                    </li>
                  );
                })}
            </ul>
          </td>
        </tr>
        <tr>
          <td>
            Related pilot names
            <ul>
              {res &&
                res.pilots.map((pilot) => {
                  const { pilotName } = pilot;
                  return (
                    <li key={pilotName}>
                        <span className="bold">{pilotName}</span>
                      </li>
                  );
                })}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
export default VehiclesTable;

// function getWithFullUrl(urlFull) {
//   return axios.get(urlFull);
// }

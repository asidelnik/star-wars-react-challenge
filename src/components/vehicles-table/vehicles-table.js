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

async function getWithFullUrlAsync(urlFull) {
  return await axios.get(urlFull);
}

function getData() {
  return (
    getWithUrlRoot("vehicles")
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
        let vehiclesPilotsWorlds = vehicleAndPilots_SpecificKeys.map(async (vehicle) => {
          for (let pilot of vehicle.pilots) {
            pilot.homeworldData = await getWithFullUrlAsync(pilot.homeworld)
          }
          return vehicle;
        });
        console.log("response", vehiclesPilotsWorlds);
        return Promise.allSettled(vehiclesPilotsWorlds);
      })
      .then(function (vehiclesPilotsWorlds) {
        console.log("homeworlds", vehiclesPilotsWorlds)
        let vehiclesPilotsWorlds_SpecificKeys = [];
        for (let vehicle of vehiclesPilotsWorlds) {
          vehiclesPilotsWorlds_SpecificKeys.push({
            vehicleUrl: vehicle.value.vehicleUrl,
            vehicleName: vehicle.value.vehicleName,
            pilots: vehicle.value.pilots
              .map(function (p) {
                return {
                  pilotName: p.name,
                  homeworld: p.homeworld,
                  homeworldPopulation: p.homeworldData.data.population
                }
              })
          });
        }
        return vehiclesPilotsWorlds_SpecificKeys;
      })
      .then(function (data) {
        console.log("response", data);
        // Set total population
        

        //  let sorted = data
        //    .sort((a, b) => b.vehi - a.population);

        // return Promise.allSettled(homeworlds)
      })

      .catch(function (error) {
        // handle error
        console.log(error);
      })
  );
}

const VehiclesTable = (props) => {
  const [res, setRes] = useState();

  useEffect(() => {
    const fn = async () => {
      const data = await getData();
      console.log({ data });
    };
    fn();
  }, []);
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


// vehiclesWithPilots.map((v) => v.pilots);//.flat();
// vehicleAndPilotsUrl.foreach((vehicle) => vehicle.pilots.map((p) => getWithFullUrl(p)))
// let pilots = pilotsUrls.map((p) => getWithFullUrl(p));
// return Promise.allSettled(pilots)
        // let homeworlds = response.map((p) => getWithFullUrl(p.value.data.homeworld));
        // return Promise.allSettled(homeworlds)
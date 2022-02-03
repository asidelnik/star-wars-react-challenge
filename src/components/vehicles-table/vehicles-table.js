const axios = require('axios');

function getVehicles() {
  // axios.get('https://swapi.py4e.com/api/planets/3/')
  axios.get('https://swapi.py4e.com/api/vehicles/')
  .then(function (response) {
    let vehiclesWithPilots = response.data.results.filter(v => v.pilots.length > 0);
    console.log(vehiclesWithPilots);
    let pilots = vehiclesWithPilots.map(v => v.pilots).flat();
    console.log(pilots);
    return vehiclesWithPilots;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

const VehiclesTable = (props) => {
  let res = undefined;
  getVehicles();

      return (
        <table id="vehicle-table">
          <tbody>
            <tr>
              <td>Vehicle name with the largest diameter sum {res && res.data.climate}</td>
            </tr>
            <tr>
              <td>Related home planets and their respective diameter {res &&res.data.diameter}</td>
            </tr>
            <tr>
              <td>Related pilot names {res && res.data.name}</td>
            </tr>
          </tbody>
        </table>
      );
}
export default VehiclesTable;
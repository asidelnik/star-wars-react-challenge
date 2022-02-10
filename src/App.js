import "./App.css";
import PlanetsPopulationBarChart from "./components/planets-population-bar-chart/planets-population-bar-chart";
import VehiclesTable from "./components/vehicles-table/vehicles-table";

function App() {
  return (
    <>
    <h2>Star Wars React Challenge</h2>
      <div className="exercise">
        <VehiclesTable />
      </div>
      <div className="exercise">
        <PlanetsPopulationBarChart />
      </div>
    </>
  );
}

export default App;

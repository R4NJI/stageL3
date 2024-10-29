import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";
import Barchart from "./components/Barchart";
import Piechart from "./components/Piechart";
import Linechart from "./components/Linechart";
import Graph from "./components/Graph";

import { DataProvider } from './DataProvider'; 
import Dashboard from "./components/Dashboard";
import Table from "./components/Table";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />}>
            <Route index element={<Dashboard />} />
            <Route path='/piechart' element={<Dashboard />} />
            <Route path='/linechart' element={<Dashboard />} />
            <Route path='/table' element={<Table />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>

  );
}

export default App;

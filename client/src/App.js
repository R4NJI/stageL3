import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";
import Barchart from "./components/Barchart";
import Piechart from "./components/Piechart";
import Linechart from "./components/Linechart";

import { DataProvider } from './DataProvider'; 

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />}>
            <Route index element={<Barchart />} />
            <Route path='/piechart' element={<Piechart />} />
            <Route path='/linechart' element={<Linechart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>

  );
}

export default App;

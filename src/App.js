import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";
import Barchart from "./components/Barchart";


function App() {
  return (

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />}>
            <Route index element={<Barchart />} />
          </Route>
        </Routes>
      </BrowserRouter>

  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";


function App() {
  return (

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />}>
          </Route>
        </Routes>
      </BrowserRouter>

  );
}

export default App;

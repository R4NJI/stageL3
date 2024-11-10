import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./Menu";
import Barchart from "./components/Barchart";
import Piechart from "./components/Piechart";
import Linechart from "./components/Linechart";
import Graph from "./components/Graph";

import { DataProvider } from './DataProvider'; 
import Dashboard from "./components/Dashboard";
import Table from "./components/Table";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu />}>
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/piechart' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/linechart' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path='/table' element={<ProtectedRoute><Table /></ProtectedRoute>} />
          </Route>
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>

  );
}

export default App;

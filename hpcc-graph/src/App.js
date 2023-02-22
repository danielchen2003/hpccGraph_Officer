import './App.css';
import HPCC_Graph from './components/HPCC_Graph';
import { Routes, Route } from "react-router"
import OfficersRelationshipGraph from './components/OfficersRelationshipGraph';
import RinGraph from './components/RinGraph';

function App() {
  return (
    <div className="App">
    <Routes>
        <Route path="/officer" element={< OfficersRelationshipGraph />} />
      
        <Route path="/hpcc" element={< HPCC_Graph />} />
        
        <Route path="/rin" element={< RinGraph />} />
      
      </Routes>
    </div>
  );
}

export default App;

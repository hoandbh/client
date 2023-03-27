import Home from "./pages/Home";
import {BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom"
import Questionnaire from './pages/Coordinators/Questionnaire/Single';
import NewQustionnire from './pages/Coordinators/Questionnaire/New';
import Many from "./pages/Coordinators/Questionnaire/List/Many"
import { AuthContextProvider } from "./context/authContext";
import Nav from "./components/Nav";


function App() {
  return <>
    <AuthContextProvider>
      <Router>
        <Nav/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire/new" element={<NewQustionnire />} />
          <Route path="/questionnaire/:id" element={<Questionnaire />} />
          <Route path="/questionnaire/many" element={<Many/>}/>
        </Routes>
      </Router>  
    </AuthContextProvider>
  </>

}

export default App;



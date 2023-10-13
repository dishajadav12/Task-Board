import './App.css';
import { BrowserRouter,Routes, Route} from "react-router-dom";
import NoteDetail from './Components/NoteDetail';
import Home from './Components/Home';
import Navbar from './Components/Navbar';


function App() {
  return (

    <BrowserRouter>
    <div>
      <Navbar/>
    </div>
      <div className="route-container">
        <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path='/notedetail' element={<NoteDetail/>}/>
        </Routes>
        </div>  
    </BrowserRouter>
  );
}

export default App;

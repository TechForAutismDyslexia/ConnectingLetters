
// import Game from './components/Game_1';
import Game from './components/Game';
import Game3 from './components/Game3';
import { BrowserRouter as Router , Routes , Route, useNavigate } from 'react-router-dom';
import './index.css';

function App() {
  const navigate = useNavigate();
  const Gamechanger = () => {
    navigate('/game3');
  };
  return (
    <div className="fgb">
      
      
        {/* <h1>Form Words using the letters!</h1> */}
        <Routes>
          <Route path="/game3" element={<Game3 />} />
          <Route path="/" element={
             <div className="card" style="width: 18rem;">
             <div class="card-body">
               <h5 class="card-title">Card title</h5>
               <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
               <a href="#" class="btn btn-primary">Go somewhere</a>
             </div>
           </div>
          } />
        </Routes>
       
      
    </div>
  );
  
}

export default App;

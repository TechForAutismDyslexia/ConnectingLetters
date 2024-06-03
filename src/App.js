
// import Game from './components/Game_1';
import Game from './components/Game';
import Game3 from './components/Game3';
import { BrowserRouter as Router , Routes , Route, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css';
import Game3_1 from './components/Game3_1';

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
          <Route path='/game3_1' element={<Game3_1/>} />
          <Route path="/" element={
             <>
             <div className="card" style={{width :"18rem"}}>
             <div class="card-body">
               <h5 class="card-title">Level 0</h5>
               <p class="card-text">Connect two letter across threads </p>
               <Link to="/game3" type='button' className='btn btn-primary'>button</Link>
             </div>
           </div>
           <div className="card" style={{width :"18rem"}}>
             <div class="card-body">
               <h5 class="card-title">Level 0</h5>
               <p class="card-text">Connect two letter across threads </p>
               <Link to="/game3_1" type='button' className='btn btn-primary'>button</Link>
             </div>
           </div>
           </>
           

          } />

        </Routes>
       
      
    </div>
  );
  
}

export default App;

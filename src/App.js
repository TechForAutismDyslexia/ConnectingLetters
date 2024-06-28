
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css';
import GameThreeOne from './components/GameThreeOne';
import Game from './components/Game';
 

function App() {
  const clicked = () => {
    const msg = new SpeechSynthesisUtterance('');
    window.speechSynthesis.speak(msg);
  }
  return (
    <div>
        {/* <h1>Form Words using the letters!</h1> */}
  
        <Routes>
          
          <Route path='/game3_1' element={<GameThreeOne/>} />
          <Route path='/game' element={<Game/>} />
          <Route path="/" element={
            <section className="container">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h1>Connecting Letters - Bridging</h1>
              <div className="card  border border-4 " style={{maxWidth:"350px",minWidth:"280px"}}>
                <div className="card-body d-flex flex-column flex-wrap justify-content-center">
                  <h5 className="card-title">Level 1</h5>
                  <img src="/Dimg.jpg" alt="Display" className="img-fluid rounded-3 border border-4 border-black"  />
                  <p className="card-text" >Connect a letter on Left Side of the page to a letter on right side of the page by following the line.</p>
                  <Link to="/game3_1" type="button" className="btn btn-primary d-block" onClick={clicked}>Game1</Link>
                  <Link to="/game" type='button' className="btn btn-primary d-block" onClick={clicked}>Game2</Link>
                </div>
              </div>
            </div>
          </section>
           

          } />

        </Routes>

       
      
    </div>
  );
  
}

export default App;

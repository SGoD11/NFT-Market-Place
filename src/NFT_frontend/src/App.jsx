import { useState } from 'react';
import { NFT_backend as backend} from 'declarations/NFT_backend';
import Header from '../components/Header';
import Footer from '../components/Footer';
import homeImage from "../dist/home-img.png";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {

 

  return (
    <div className="App">
      <Header />
      <img className="bottom-space" src={homeImage} />
      <Footer />
    </div>
  );
}

export default App;

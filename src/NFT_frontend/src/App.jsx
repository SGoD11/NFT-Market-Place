import { useEffect, useState } from 'react';
import { NFT_canister as NFT } from 'declarations/NFT_canister';
import Header from '../components/Header';
import Footer from '../components/Footer';
import homeImage from "/home-img.png";
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

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import homeImage from "/home-img.png";
import "bootstrap/dist/css/bootstrap.min.css";
import Item from '../components/Item';
function App() {

  // canister id->  dfx canister id <Canister_name>
  const NFT_id = "bkyz2-fmaaa-aaaaa-qaaaq-cai";



  return (
    <div className="App">
      <Header />
      {/* passing the canister ID for fetching data in the item container */}
      <Item id ={NFT_id} />
     
      <img className="bottom-space" src={homeImage} />
      {/* < h1 className='' style={{"color":"red"}}> asd {NFT_id}</h1> */}
      
      <Footer />
    </div>
  );
}

export default App;

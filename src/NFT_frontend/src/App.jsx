import { useEffect, useState } from 'react';
import { NFT } from 'declarations/NFT';
import Header from '../components/Header';
import Footer from '../components/Footer';
import homeImage from "/home-img.png";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {

  const [Notes, setNotes] = useState('');
  useEffect(()=>{
    const fetch = async()=>{
      const fetchedNotes = await NFT.greet();
      setNotes(fetchedNotes);
      await NFT.insert(fetchedNotes);
      
    };
    fetch();
  },[]);


  return (
    <div className="App">
      <Header />
      <img className="bottom-space" src={homeImage} />
      {Notes}
      <Footer />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import logo from "/logo.png";
import homeImage from "/home-img.png";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { NFT_backend } from "../../declarations/NFT_backend";
import CURRENT_USER_ID from "./index";


function Header() {

  const [userOwnedGallery, setUserOwnedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();

  async function getNFTs() {
    const userNFTIds = await NFT_backend.getOwnedNFTs(CURRENT_USER_ID);
    console.log(userNFTIds);
    setUserOwnedGallery(<Gallery title="My NFT's" ids={userNFTIds} role="collection" />);
    const listedNFTIds = await NFT_backend.getListedNFTIds();
    setListingGallery(<Gallery title="Discover" ids={listedNFTIds} role="discover" />);
  };

  useEffect(() => {
    getNFTs();
  }, []);

  // for force reloading



  return (
    <BrowserRouter forceRefresh={true}>
      <div className="app-root-1">
        <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
          <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
            <div className="header-left-4"></div>
            <img className="header-logo-11" src={logo} />
            <div className="header-vertical-9"></div>
            <h5 className="Typography-root header-logo-text">
              <Link to="/">
                NFT Market Place
              </Link>
            </h5>
            <div className="header-empty-6"></div>
            <div className="header-space-8"></div>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/discover">
                {listingGallery}
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/minter">
                Minter
              </Link>
            </button>
            <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
              <Link to="/collection">
                My NFTs
              </Link>
            </button>
          </div>
        </header>
      </div>
      <Routes>
        <Route exact path="/" element={<img className="bottom-space" src={homeImage} />}>

        </Route>
        <Route path="/discover" element={<h1>Discover</h1>}>

        </Route>
        <Route path="/minter" element={<Minter />}>

        </Route>
        <Route path="/collection" element={userOwnedGallery}>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Header;

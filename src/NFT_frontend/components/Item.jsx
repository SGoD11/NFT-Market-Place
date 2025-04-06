import React, { act, useEffect, useState } from "react";
import logo from "/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/Canister";
import { Principal } from "@dfinity/principal";

//importing canister to see whether everything is fine
import { Canister as NFT } from "../../declarations/Canister";
import Button from "./Button";
import { NFT_backend } from "../../declarations/NFT_backend";
import CURRENT_USER_ID from ".";
import PriceLabel from "./PriceLabel";

function Item(props) {

  // for storing the data
  const [name, setName] = useState("dhar");
  const [owner, setOwner] = useState("HGYft9u81728");
  const [imageData, setImageData] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput] = useState();
  const [loaderHidden, setloaderHidden] = useState(true);
  const [blur, setBlur]= useState();
  const [sellStatus, setSellStatus ] = useState("");
  const [priceLabel, setPriceLabel] = useState()

  // Taking the id of the canister to fetch data from the host using the dfinity agent
  const id = props.id;
  const host = "http://127.0.0.1:3000";
  // not working for certification verification so best option is to disable certificate verification
  const agent = new HttpAgent({ host, disableCertificateVerification: true });

  let NFTActor;

  //  making the actor agent work, with class actor we need to use this type of code semantics 
  async function loadNFT() {
    try {
      // for gaining root key access to bypass agent problem (agent invalid certification)
      await agent.fetchRootKey();
      NFTActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: id,
      });

      // calling the Actor.methods() to get data 

      const name = await NFTActor.getName();
      const owner = await NFTActor.getOwner();
      const imagedata = await NFTActor.getAsset();


       
      //converting the nat 8 to unit 8 array
      const imageContent = new Uint8Array(imagedata);
      const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
      // setting the required data
      setName(name);
      setOwner(owner.toText());
      setImageData(image);

      if(props.role == "collection"){
    const nftIsListed = await NFT_backend.isListed(props.id);
    if(nftIsListed){
      setOwner("NFT Market Place");
      setBlur({filter: "blur(4px)"});
      setSellStatus("Listed");
    }else{

      setButton(<Button handleClick={handleSell} text={"Sell"} />);
    }}
    else if (props.role == "discover"){
      const originalOwner = await NFT_backend.getOriginalOwner(props.id);
      if(originalOwner.toText() != CURRENT_USER_ID.toText()){

        setButton(<Button handleClick={handleBuy} text={"Buy"} />);
      }

      const price = await NFT_backend.getListedNFTPrice(props.id);
      setPriceLabel(<PriceLabel sellPrice={price.toString()} />)

    }

      const data = {
        name, owner: owner.toText(), image
      };
      return data;
    }
    catch (error) {
      return error;
    }
  };

  // to check whether backend canister is working
  async function backend() {
    try {
      const name = await NFT.getName();
      const owner = (await NFT.getOwner()).toText();
      const Asset = await NFT.getAsset();
      // conversion of nat 8 image or blob to png
      const imageContent = new Uint8Array(Asset);
      const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: "image/png" }));
      const data = {
        name, owner, image
      };
      // setName(name); // working fine ✔️
      // setOwner(owner); // working fine ✔️
      return data; // getting the output ✔️
    }
    catch (error) {
      return error;
    }
  };

  // calling the methods on first render
  useEffect(() => {
    const check = async () => {
      const load = await loadNFT(); // not working?? ❌
      const back = await backend(); // working ✔️
      console.log("running");
      console.log("LoadNFT ", load);
      console.log("Backend ", back);
    };
    check();
  }, []);

  let price;
  function handleSell() {
    console.log("sell clicked");
    setPriceInput(<input
      placeholder="Price in DANG"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price = e.target.value}
    />);
    console.log(price);
    setButton(<Button handleClick={sellItem} text={"Confirm"} />);
  };
  async function sellItem() {
    setBlur({filter: "blur(4px)"});
    setloaderHidden(false)
    console.log("confirm click " + parseInt(price) + " and type is " + typeof (price));
    const listingResult = await NFT_backend.listItem(props.id, parseInt(price));
    console.log("Listing " + listingResult);
    if (listingResult == "Success") {
      const Market_ID = await NFT_backend.getOpenDCanisterID();
      const transferResult = await NFTActor.transferOwnerShip(Market_ID);
      console.log("transfer is " + transferResult);
      if(transferResult == "Success"){
        setloaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("NFT market");
        setSellStatus("Listed");
      }
    }
  };

  async function handleBuy(){
    console.log("Buy was triggered")
  }

  !imageData ? console.log("problem") : console.log("no problem", imageData);


  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={imageData}
          style={blur}
        />
        {/* Loader */}
        <div hidden={loaderHidden} className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
              {name }
            <span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );

}

export default Item;

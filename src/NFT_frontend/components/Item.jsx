import React, { act, useEffect, useState } from "react";
import logo from "/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/Canister";
import { Principal } from "@dfinity/principal";

//importing canister to see whether everything is fine
import { Canister as NFT } from "../../declarations/Canister";

function Item(props) {

  // for storing the data
  const [name, setName] = useState("dhar");
  const [owner, setOwner] = useState("HGYft9u81728");
  const [imageData, setImageData ] = useState();
  // Taking the id of the canister to fetch data from the host using the dfinity agent
  const id = Principal.fromText(props.id);
  const host = "http://127.0.0.1:3000";
  // not working for certification verification so best option is to disable certificate verification
  const agent = new HttpAgent({ host, disableCertificateVerification: true });

  //  making the actor agent work, with class actor we need to use this type of code semantics 
  async function loadNFT() {
    try {
      // for gaining root key access to bypass agent problem (agent invalid certification)
      await agent.fetchRootKey();
      const NFTActor = Actor.createActor(idlFactory, {
        agent,
        canisterId: id,
      });

      // calling the Actor.methods() to get data 

      const name = await NFTActor.getName();
      const owner = await NFTActor.getOwner();
      const imagedata = await NFTActor.getAsset();

      //converting the nat 8 to unit 8 array
      const imageContent = new Uint8Array(imagedata);
      const image = URL.createObjectURL(new Blob([imageContent.buffer],{type: "image/png"}));
      // setting the required data
      setName(name);
      setOwner(owner.toText());
      setImageData(image);

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
      const image = URL.createObjectURL(new Blob([imageContent.buffer],{type: "image/png"}));
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

  !imageData ? console.log("problem") : console.log("no problem",imageData);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        {/* <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={imageData}
        /> */}

        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            <span className="purple-text">
              {name}
            </span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;

import React, { useEffect, useState } from "react";
import Item from "./Item";
import { Principal } from "@dfinity/principal";

function Gallery(props) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(props.ids) && props.ids.length > 0) {
      console.log("Received NFT IDs:", props.ids);

      const nftComponents = props.ids.map((NFTId) => (
        <Item id={NFTId} key={NFTId.toText()} />
      ));

      setItems(nftComponents);
    } else {
      console.warn("No NFTs to display or props.ids is undefined.");
    }
  }, [props.ids]); // Make sure we run again if ids change

  return (
    <div className="gallery-view">
      <h3 className="makeStyles-title-99 Typography-h3">{props.title}</h3>
      <div className="disGrid-root disGrid-container disGrid-spacing-xs-2">
        <div className="disGrid-root disGrid-item disGrid-grid-xs-12">
          <div className="disGrid-root disGrid-container disGrid-spacing-xs-5 disGrid-justify-content-xs-center">
            {items.length > 0 ? items : <p>No NFTs found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;

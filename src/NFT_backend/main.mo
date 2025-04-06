import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Nat "mo:base/Nat";
import NFTActorClass "../Canister/canister";
import Canister "../Canister/canister";

actor NftMarketPlace {

  private type Listing = {
    itemOwner: Principal;
    itemPrice: Nat;
  };
  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1, Principal.equal, Principal.hash);
  public shared (msg) func mint(imgData : [Nat8], name : Text) : async Principal {
    let owner : Principal = msg.caller;
    Cycles.add(100_500_000_000);
    Debug.print(debug_show (Cycles.balance()));

    let newNFT = await NFTActorClass.NFT(name, owner, imgData);
    let newCFTPrincipal = await newNFT.getCanisterId();

    mapOfNFTs.put(newCFTPrincipal, newNFT);
    addToOwnerShipMap(owner, newCFTPrincipal);

    return newCFTPrincipal;
  };
  private func addToOwnerShipMap(owner : Principal, nftId : Principal) {
    var ownedNFTs : List.List<Principal> = switch (mapOfOwners.get(owner)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    ownedNFTs := List.push(nftId, ownedNFTs);
    mapOfOwners.put(owner, ownedNFTs);
  };

  public query func getOwnedNFTs(user: Principal):async [Principal]{
    var userNFTs: List.List<Principal> = switch (mapOfOwners.get(user)) {
      case null List.nil<Principal>();
      case (?result) result;
    };
    return List.toArray(userNFTs);
  };

  public shared(msg) func listItem(id: Principal, price: Nat): async Text{
    var item: NFTActorClass.NFT = switch (mapOfNFTs.get(id)){
      case null return "NFT does not exists";
      case (?result) result;
    };
    let owner =await item.getOwner();
    if (Principal.equal(owner, msg.caller)){
      let newListing: Listing={
        itemOwner = owner;
        itemPrice = price;
      };
      mapOfListings.put(id, newListing);
      return "Success";
    }else{ 
      return "You do not own this NFT";
    };

    return "Success";
  };
  public query func getOpenDCanisterID(): async Principal{
    return Principal.fromActor(NftMarketPlace);
  };
  public query func isListed (id: Principal):async Bool{
    if(mapOfListings.get(id) == null){
      return false;
    }else{
      return true;
    };
  };
};

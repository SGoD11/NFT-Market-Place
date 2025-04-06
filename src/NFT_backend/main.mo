import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import NFTActorClass "../Canister/canister";

actor NftMarketPlace {
  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1, Principal.equal, Principal.hash);
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
  }
};

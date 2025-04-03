import Debug "mo:base/Debug";
import Text "mo:base/Text";
actor NFT  {
 Debug.print("It Works");
 Debug.print("NOICE");
 public query func greet(): async Text{
    // return Debug.print(debug_show ("Thats me"));
    return "Thats me";
 };
 public func insert(val: Text){
  Debug.print(debug_show ("This is value ", val));
 };

};

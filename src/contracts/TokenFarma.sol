pragma solidity  ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarma{ //Pametni ugovor
 // Cijeli kod ide ovdije

    string public name = "Dapp token farma ";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daitoken) public {
    
        dappToken = _dappToken;
        daiToken = _daitoken;
    
    }
}



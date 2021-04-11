pragma solidity  ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarma{ //Pametni ugovor
 // Cijeli kod ide ovdije

      string public name = "Dapp Token Farma";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    function ulogTokena(uint _amount) public {
        // Zahtijevajte iznos veći od 0
        require(_amount > 0, "iznos ne moze biti nula");

        // Prenesite Mock Dai tokens na ovaj ugovor za ulaganja
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Ažurirajte stanje uloga
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Dodajte korisnika u niz samo ako već nije uložio
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Ažuriranje statusa isplate
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    // Povrat tokena
    function povratTokena() public {
        // Dohvati stanje uloga tokena
        uint balance = stakingBalance[msg.sender];

        // Zahtijevajte iznos veći od 0
        require(balance > 0, "iznos ne moze biti nula");

        //Prenesite Mock Dai tokens na ovaj ugovor za ulaganja
        daiToken.transfer(msg.sender, balance);

        // resetirati stanje ulaganja
        stakingBalance[msg.sender] = 0;

        // Azuriraj status ulaganja
        isStaking[msg.sender] = false;
    }

    // davanje tokena
    function izdaniTokeni() public {
        // Samo vlasnik može pozvati ovu funkciju
        require(msg.sender == owner, "ovu funkciju poziva samo vlasnik");

        // daj tokene svim ulagacima
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}



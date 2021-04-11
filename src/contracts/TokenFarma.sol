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
    mapping(address => uint) public ulogStanje;
    mapping(address => bool) public uzeto;
    mapping(address => bool) public jeUzeto;

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
        ulogStanje[msg.sender] = ulogStanje[msg.sender] + _amount;

        // Dodajte korisnika u niz samo ako već nije uložio
        if(!uzeto[msg.sender]) {
            stakers.push(msg.sender);
        }

        // Ažuriranje statusa isplate
        jeUzeto[msg.sender] = true;
        uzeto[msg.sender] = true;
    }

    // Povrat tokena
    function povratTokena() public {
        // Dohvati stanje uloga tokena
        uint balance = ulogStanje[msg.sender];

        // Zahtijevajte iznos veći od 0
        require(balance > 0, "iznos ne moze biti nula");

        //Prenesite Mock Dai tokens na ovaj ugovor za ulaganja
        daiToken.transfer(msg.sender, balance);

        // resetirati stanje ulaganja
        ulogStanje[msg.sender] = 0;

        // Azuriraj status ulaganja
        jeUzeto[msg.sender] = false;
    }

    // davanje TokenFarma
    function izdaniTokeni() public {
        // Samo vlasnik može pozvati ovu funkciju
        require(msg.sender == owner, "ovu funkciju poziva samo vlasnik");

        // daj tokene svim ulagacima
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = ulogStanje[recipient];
            if(balance > 0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}



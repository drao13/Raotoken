pragma solidity >=0.4.17;

contract DappToken {

string public name = "Token";
string public symbol = "TOKEN";
string public standard = "Token Version 1";

    uint256 public tokens;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed buyer, uint256 value);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    constructor(uint256 StartingSupply) public {
        balanceOf[msg.sender] = StartingSupply;
        tokens = StartingSupply;
    }

    function transfer(address to, uint256 value) public returns (bool works) {
        require(balanceOf[msg.sender] >= value);

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);

        return true;
    }

    function approve(address buyer, uint256 value) public returns (bool success) {

        allowance[msg.sender][buyer] = value;

        emit Approval(msg.sender, buyer, value);

        return true;
    }

    function transferfrom(address from, address to, uint256 value) public returns (bool success) {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);
        return true;
    }

}

import "./provableAPI_0.5.sol";
import "./SafeMath.sol";

pragma solidity =0.5.16;

contract Coinflip is usingProvable {
    
    using SafeMath for uint;
    
    struct Bet {
        address playerAddress;
        uint betValue;
        uint headsTails;
    }
    
    mapping(address => uint) private playerWinnings;
    mapping (address => Bet) private waiting;
    mapping (bytes32 => address) private afterWaiting;
    
    event logNewProvableQuery(string description);
    event result(address caller, uint256 amount, bool won);
    
    uint public contractBalance;
    uint256 constant NUM_RANDOM_BYTES_REQUESTED = 1;
    
    address payable public owner = msg.sender;

    
    constructor() public payable{
        owner = msg.sender;
        contractBalance = msg.value;
    }
    
    
    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    
    
function flip(uint256 oneZero) public payable {
        //Minimum .001 eth to maximum 10 eth
        require(contractBalance > msg.value, "We don't have enough funds");

        //Calling provable library function
        uint256 QUERY_EXECUTION_DELAY = 0;
        uint256 GAS_FOR_CALLBACK = 200000;
        bytes32 queryId = provable_newRandomDSQuery(
            QUERY_EXECUTION_DELAY,
            NUM_RANDOM_BYTES_REQUESTED,
            GAS_FOR_CALLBACK
            );
        emit logNewProvableQuery("Message sent. Waiting for an answer...");
        
        afterWaiting[queryId] = msg.sender;


        //Adding user to mapping with address, bet, and queryID
        Bet memory newBetter;
        newBetter.playerAddress = msg.sender;
        newBetter.betValue = msg.value;
        newBetter.headsTails = oneZero;

        waiting[msg.sender] = newBetter;
    }
    
    function __callback(bytes32 _queryId, string memory _result /*bytes memory _proof*/) public {
        require(msg.sender == provable_cbAddress());
        
        uint256 flipResult = SafeMath.mod(uint256(keccak256(abi.encodePacked(_result))), 2);

        //linking new mapping with new struct
        address _player = afterWaiting[_queryId];
        
        Bet memory postBet = waiting[_player];
        
        if(flipResult == postBet.headsTails){
            uint winAmount = SafeMath.mul(postBet.betValue, 2);
            contractBalance = SafeMath.sub(contractBalance, postBet.betValue);
            playerWinnings[_player] = SafeMath.add(playerWinnings[_player], winAmount);
            emit result(_player, winAmount, true);
        } else {
            contractBalance = SafeMath.add(contractBalance, postBet.betValue);
            emit result(_player, postBet.betValue, false);
        }
    }
    
    function withdrawUserWinnings() public {
        require(playerWinnings[msg.sender] > 0, "No funds to withdraw");
        uint toTransfer = playerWinnings[msg.sender];
        playerWinnings[msg.sender] = 0;
        msg.sender.transfer(toTransfer);
    }
    
    function getWinningsBalance() public view returns(uint){
        return playerWinnings[msg.sender];
    }
    
    //Owner functions
    
    function fundContract() public payable onlyOwner {
        contractBalance = SafeMath.add(contractBalance, msg.value);
    }
    
    function fundWinnings() public payable onlyOwner {
        playerWinnings[msg.sender] = SafeMath.add(playerWinnings[msg.sender], msg.value);
    }
    
    function withdrawAll() public onlyOwner {
        uint toTransfer = contractBalance;
        contractBalance = 0;
        msg.sender.transfer(toTransfer);
    }

}
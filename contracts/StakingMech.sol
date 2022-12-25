// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract StakingMech is Pausable, Ownable, ReentrancyGuard {
    IERC20 public immutable stakingToken;
    // IERC20 public immutable rewardsToken;

    uint public year = 31536000;
    // Duration of rewards to be paid out (in seconds)
    uint public finishAt;
    // Reward to be paid out per second
    uint public interestRate = 10; //10% annual return

    uint256 public planExpired;

    mapping(address => uint) stakeAmount;
    // Total staked
    uint public totalStaked;
    // User address => staked amount
    struct StakeInform {
        uint256 stakeAmount;
        uint256 earnedAmount;
        uint256 totalBalance;
        uint256 lastUpdate;
    }

    mapping(address => StakeInform) public stakeInfos;

    event Staked(address indexed from, uint256 amount);
    event Claimed(address indexed from, uint256 amount);

    constructor(address _stakingToken) Ownable() {
        require(
            address(_stakingToken) != address(0),
            "Token Address cannot be address 0"
        );
        stakingToken = IERC20(_stakingToken);
        planExpired = block.timestamp + year;
    }

    modifier checkData() {
        require(block.timestamp < planExpired, "Plan Expired");
        _;
    }

    function updateReward(address _account) private {
        uint _stakeAmount = stakeInfos[_account].stakeAmount;
        uint _earnedAmount = stakeInfos[_account].earnedAmount;
        uint _lastUpdate = stakeInfos[_account].lastUpdate;

        _earnedAmount = block.timestamp - (_lastUpdate * interestRate) / year;
        stakeInfos[_account].totalBalance = _stakeAmount + _earnedAmount;
        stakeInfos[_account].lastUpdate = block.timestamp;
        stakeInfos[_account].earnedAmount = _earnedAmount;
    }

    function stake(uint _amount) external nonReentrant checkData {
        require(_amount > 0, "Stake amount should be correct");
        require(block.timestamp < planExpired, "Plan Expired");

        updateReward(_msgSender());
        stakeInfos[_msgSender()].totalBalance += _amount;
        totalStaked += _amount;
        stakingToken.transferFrom(_msgSender(), address(this), _amount);
    }

    function withdraw(uint _amount) external nonReentrant checkData {
        require(_amount > 0, "Amount = 0");
        require(
            _amount > stakeInfos[_msgSender()].totalBalance,
            "Can't withdraw more then balance"
        );
        updateReward(_msgSender());
        stakeInfos[_msgSender()].totalBalance -= _amount;
        totalStaked -= _amount;
        stakingToken.transfer(_msgSender(), _amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // function _beforeTokenTransfer(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) internal override whenNotPaused {
    //     super._beforeTokenTransfer(from, to, amount);
    // }
}

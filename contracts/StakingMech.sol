// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";

error StakingMech_PlanExpired();
error StakingMech_TokenAddressCannotBeZero();
error StakingMech_StakeAmountCannotBeZero();
error StakingMech_AmountCannotBeZero();
error StakingMech_WithdrawAmountCannotBeBiggerThenBallance();

contract StakingMech is Ownable, ReentrancyGuard {
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
        if (address(_stakingToken) == address(0)) {
            revert StakingMech_StakeAmountCannotBeZero();
        }
        stakingToken = IERC20(_stakingToken);
        planExpired = block.timestamp + year;
    }

    modifier checkData() {
        if (block.timestamp > planExpired) {
            revert StakingMech_PlanExpired();
        }
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
        if (_amount < 0) {
            revert StakingMech_AmountCannotBeZero();
        }
        updateReward(_msgSender());
        stakeInfos[_msgSender()].totalBalance += _amount;
        totalStaked += _amount;
        stakingToken.transferFrom(_msgSender(), address(this), _amount);
    }

    function withdraw(uint _amount) external nonReentrant checkData {
        if (_amount <= 0) {
            revert StakingMech_AmountCannotBeZero();
        }
        if (_amount > stakeInfos[_msgSender()].totalBalance) {
            revert StakingMech_WithdrawAmountCannotBeBiggerThenBallance();
        }

        updateReward(_msgSender());
        stakeInfos[_msgSender()].totalBalance -= _amount;
        totalStaked -= _amount;
        stakingToken.transfer(_msgSender(), _amount);
    }
}

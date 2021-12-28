// SPDX-License-Identifier: MIT

pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FuelToken is ERC20, Ownable {

    using EnumerableSet for EnumerableSet.AddressSet;
    EnumerableSet.AddressSet private burners;
    EnumerableSet.AddressSet private minters;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

    function addBurner(address _account) external onlyOwner {
        burners.add(_account);
    }

    function removeBurner(address _account) external onlyOwner {
        burners.remove(_account);
    }

    function isBurner(address _account) public view returns(bool) {
        return burners.contains(_account);
    }

    function addMinter(address _account) external onlyOwner {
        minters.add(_account);
    }

    function removeMinter(address _account) external onlyOwner {
        minters.remove(_account);
    }

    function isMinter(address _account) public view returns(bool) {
        return minters.contains(_account);
    }

    function burn(address _from, uint256 _amount) external {
        require(allowance(_from, _msgSender()) >= _amount, "not enough allowance");
        require(isBurner(_msgSender()), "caller is not burner");
        _burn(_from, _amount);
    }

    function mint(address _to, uint256 _amount) external {
        require(isMinter(_msgSender()), "caller is not minter");
        _mint(_to, _amount);
    }



}
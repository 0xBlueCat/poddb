// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./interfaces/IPodDB.sol";

library TagFlags {
    function buildFlags( bool canInherit)
        internal
        pure
        returns (uint8)
    {
        uint8 flags = 0;
        if (canInherit) {
            flags |= 1;
        }
        return flags;
    }

    function hasInheritFlag(uint8 flag) internal pure returns (bool) {
        return flag & 1 != 0;
    }

    function flagsValid(uint8 flag) internal pure returns(bool){
        return flag ==0 || flag == 1;
    }
}

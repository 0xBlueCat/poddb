// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "./WriteBuffer.sol";
import "./ReadBuffer.sol";
import "./Common.sol";

library Helper {
    using WriteBuffer for *;
    using ReadBuffer for *;
    using Common for *;

    function buildFlags(
        bool multiIssue,
        bool canInherit,
        bool isPublic
    ) internal pure returns (uint8) {
        uint8 flags = 0;
        if (multiIssue) {
            flags |= 1;
        }
        if (canInherit) {
            flags |= 2;
        }
        if (isPublic) {
            flags |= 4;
        }
        return flags;
    }

    struct TagClassFieldBuilder {
        WriteBuffer.buffer _buf;
        uint256 _count;
    }

    function init(
        TagClassFieldBuilder memory builder,
        WriteBuffer.buffer memory buf
    ) internal pure returns (TagClassFieldBuilder memory) {
        builder._buf = buf.writeUint8(0);
        builder._count = 0;
        return builder;
    }

    function put(
        TagClassFieldBuilder memory builder,
        string memory fieldName,
        Common.TagFieldType fieldType
    ) internal pure returns (TagClassFieldBuilder memory) {
        builder._buf.writeString(fieldName).writeUint8(uint8(fieldType));
        builder._count++;
        return builder;
    }

    function build(TagClassFieldBuilder memory builder)
        internal
        pure
        returns (bytes memory)
    {
        return builder._buf.writeVarUintAt(0, builder._count, 1).getBytes();
    }
}
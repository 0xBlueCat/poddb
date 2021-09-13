import { WriteBuffer } from "./WriteBuffer";
import { ethers } from "ethers";

export enum TagFieldType {
  Bool,
  Uint,
  Uint8,
  Uint16,
  Uint32,
  Uint64,
  Int,
  Int8,
  Int16,
  Int32,
  Int64,
  Bytes1,
  Bytes2,
  Bytes3,
  Bytes4,
  Bytes8,
  Bytes20,
  Bytes32,
  Address,
  Bytes,
  String,
}

export enum AgentType {
  Address,
  Tag,
}

export class TagAgentBuilder {
  public Type: AgentType;
  public Agent: string; //EOA address, contract address or tagSchemaId

  constructor(agentType: AgentType, agent: string) {
    this.Type = agentType;
    this.Agent = new WriteBuffer(20).writeBytes20(agent).getBytes();
  }

  public build(): [AgentType, string] {
    return [this.Type, this.Agent];
  }
}

export const NoTagAgent = new TagAgentBuilder(AgentType.Address, "0x").build();

export function buildTagObject(address: string, tokenId: string = "0"):[string, string]{
  const addressStr = new WriteBuffer(20).writeAddress(address).getBytes();
  const tokenIdsStr = new WriteBuffer(20)
      .writeUint(ethers.BigNumber.from(tokenId))
      .getBytes();
  return [addressStr,  tokenIdsStr];
}

export interface TagSchemaField {
  fieldName: string;
  fieldType: TagFieldType;
}

export class TagSchemaFieldBuilder {
  private fields: TagSchemaField[];
  public constructor() {
    this.fields = [] as TagSchemaField[];
  }

  public put(
    fieldName: string,
    fieldType: TagFieldType
  ): TagSchemaFieldBuilder {
    this.fields.push({ fieldName, fieldType });
    return this;
  }

  public build(): string {
    const buf: WriteBuffer = new WriteBuffer();
    buf.writeUint8(this.fields.length);
    this.fields.forEach((field) => {
      buf.writeString(field.fieldName);
      buf.writeUint8(field.fieldType);
    });
    return buf.getBytes();
  }
}

export type TagDataBuilder = WriteBuffer;
import { SymbolBase } from './SymbolBase.js';

export class Identifier extends SymbolBase
{
    constructor(symbolCode, stringValue)
    {
        super(symbolCode, stringValue, stringValue);
    }
}
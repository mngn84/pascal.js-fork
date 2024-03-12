import { TreeNodeBase } from './TreeNodeBase.js';

export class Variable extends TreeNodeBase
{
    constructor(symbol, right)
    {
        super(symbol);
        this.right = right;
    }
}
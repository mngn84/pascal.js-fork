import {TreeNodeBase} from './TreeNodeBase.js';

export class UnaryMinus extends TreeNodeBase
{
    constructor(symbol, right)
    {
        super(symbol);
        this.right = right;
    }
}

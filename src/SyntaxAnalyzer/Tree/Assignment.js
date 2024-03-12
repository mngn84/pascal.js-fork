import { BinaryOperation } from './BinaryOperation.js';

export class Assignment extends BinaryOperation
{
    constructor(symbol, left, right)
    {
        super(symbol, left, right);
    }
}
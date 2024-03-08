import { Multiplication } from './Tree/Multiplication.js';
import { Division } from './Tree/Division.js';
import { Addition } from './Tree/Addition.js';
import { Subtraction } from './Tree/Subtraction.js';
import { NumberConstant } from './Tree/NumberConstant.js';
import { UnaryMinus } from './Tree/UnaryMinus.js';
import { Parentheses } from './Parentheses.js';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes.js';

/**
 * Синтаксический анализатор - отвечат за построения дерева выполнения
 */
export class SyntaxAnalyzer
{
    constructor(lexicalAnalyzer)
    {
        this.lexicalAnalyzer = lexicalAnalyzer;
        this.symbol = null;
        this.tree = null;
        this.trees = [];
    }

    nextSym()
    {
        this.symbol = this.lexicalAnalyzer.nextSym();
    }

    accept(expectedSymbolCode)
    {
        if ( this.symbol === null) {
            throw `${expectedSymbolCode} expected but eol found!`;
        }
        if (this.symbol.symbolCode === expectedSymbolCode) {
            this.nextSym();
        } else {
            throw `${expectedSymbolCode} expected but ${this.symbol.symbolCode} found!`;
        }
    }

    analyze()
    {
        this.nextSym();

        while (this.symbol !== null) {
            let expression = this.scanExpression();
            this.trees.push(expression);

            // Последняя строка может не заканчиваться переносом на следующую строку.
            if (this.symbol !== null) {
                this.accept(SymbolsCodes.endOfLine);
            }

        }

        return this.tree;
    }
    // Разбор выражения
    scanExpression()
    {
        let term = this.scanTerm();
        let operationSymbol = null;

        while ( this.symbol !== null && (
                    this.symbol.symbolCode === SymbolsCodes.plus ||
                    this.symbol.symbolCode === SymbolsCodes.minus
            )) {

            operationSymbol = this.symbol;
            this.nextSym();

            switch (operationSymbol.symbolCode) {
                case SymbolsCodes.plus:
                    term = new Addition(operationSymbol, term, this.scanTerm());
                    break;
                case SymbolsCodes.minus:
                    term = new Subtraction(operationSymbol, term, this.scanTerm());
                    break;
            }
        }

        return term;
    }
    // Разбор слагаемого
    scanTerm()
    {
        let term = this.scanUnaryMinus();
        let operationSymbol = null;

        while ( this.symbol !== null && (
                    this.symbol.symbolCode === SymbolsCodes.star ||
                    this.symbol.symbolCode === SymbolsCodes.slash
            )) {

            operationSymbol = this.symbol;
            this.nextSym();

            switch (operationSymbol.symbolCode) {
                case SymbolsCodes.star:
                    term = new Multiplication(operationSymbol, term, this.scanUnaryMinus());
                    break;
                case SymbolsCodes.slash:
                    term = new Division(operationSymbol, term, this.scanUnaryMinus());
                    break;
            }
        }

        return term;
    }
    //Проверка на унарный минус
    scanUnaryMinus() {
        if (this.symbol !== null && this.symbol.symbolCode === SymbolsCodes.minus) { 
            let unMinus = this.symbol;
            this.nextSym();

            let negMultiplier = new UnaryMinus(unMinus, this.scanParentheses())
            
            return negMultiplier;
        }else{
            
            return this.scanParentheses();
        }
    }
    //Разбор скобок
    scanParentheses() {
        if (this.symbol !== null && this.symbol.symbolCode === SymbolsCodes.opening) {
            this.nextSym();
            
            let subtree = [this.scanExpression()];
            this.accept(SymbolsCodes.closing);
            
            return new Parentheses(subtree);
        }else{
            return this.scanMultiplier();
        }
    }
    // Разбор множителя
    scanMultiplier()
    {
        let integerConstant = this.symbol;

        this.accept(SymbolsCodes.integerConst);

        return new NumberConstant(integerConstant);
    }
};

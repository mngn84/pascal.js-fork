import { Addition } from '../SyntaxAnalyzer/Tree/Addition.js';
import { Multiplication } from '../SyntaxAnalyzer/Tree/Multiplication.js';
import { Subtraction } from '../SyntaxAnalyzer/Tree/Subtraction.js';
import { Division } from '../SyntaxAnalyzer/Tree/Division.js';
import { NumberConstant } from '../SyntaxAnalyzer/Tree/NumberConstant.js';
import { Variable } from '../SyntaxAnalyzer/Tree/Variable.js';
import { UnaryMinus } from '../SyntaxAnalyzer/Tree/UnaryMinus.js';
import { NumberVariable } from './Variables/NumberVariable.js';
import { Equality } from './Variables/Equality.js';
import { Parentheses } from '../SyntaxAnalyzer/Tree/Parentheses.js';
import { Assignment } from '../SyntaxAnalyzer/Tree/Assignment.js';

export class Engine
{
    /**
     * Результаты вычислений (изначально - один для каждой строки)
     * 
     * @type string[]
     */
    results;

    constructor(trees)
    {
        this.trees = trees;
        this.results = [];
        this.variables = {};
    }

    run()
    {
        let self = this;

        this.trees.forEach(

            function(tree, i)
            {   self.counter = i; 
                
                let result = self.evaluateSimpleExpression(tree);
                
                if (result.variable) {
                    console.log(result.variable + ' = ' + result.value);
                } else {
                    console.log(result.value + 0);
                }   
                self.results.push(result.value); // пишем в массив результатов
            }
        );

    }

    evaluateSimpleExpression(expression)
    {
        if (expression instanceof Addition ||
                expression instanceof Subtraction) {

            let leftOperand = this.evaluateSimpleExpression(expression.left);
            let rightOperand = this.evaluateSimpleExpression(expression.right);

            let result = null;
            if (expression instanceof Addition) {
                result = leftOperand.value + rightOperand.value;
            } else if (expression instanceof Subtraction) {
                result = leftOperand.value - rightOperand.value;
            }

            return new NumberVariable(result);
        } else {
            return this.evaluateTerm(expression);
        }
    }

    evaluateTerm(expression)
    {
        if (expression instanceof Multiplication) {
            let leftOperand = this.evaluateTerm(expression.left);
            let rightOperand = this.evaluateTerm(expression.right);
            let result = leftOperand.value * rightOperand.value;

            return new NumberVariable(result);
        } else if (expression instanceof Division) {
            let leftOperand = this.evaluateTerm(expression.left);
            let rightOperand = this.evaluateTerm(expression.right);
            let result = leftOperand.value / rightOperand.value;

            return new NumberVariable(result);
        } else {
            return this.evaluateUnaryMinus(expression);
        }
    }

    evaluateUnaryMinus(expression)
    {     
        if (expression instanceof UnaryMinus) {
            let rightOperand = this.evaluateParentheses(expression.right);            
            let result = - rightOperand.value;
        
            return new NumberVariable(result);
        } else {
            return this.evaluateParentheses(expression);
        }
    }

    evaluateParentheses(expression)
    {
        if (expression instanceof Parentheses) {
           
            let result = new NumberVariable(this.evaluateSimpleExpression(expression.symbol));
            return result.value
        } else {
            return this.evaluateAssignment(expression);
        }
    }
    
    evaluateAssignment(expression)
    {
        if (expression instanceof Assignment) {
            let variables = this.variables;
            let variable = expression.left;
           
            let value = this.evaluateSimpleExpression(expression.right)
            variables[variable.value] = value.value;

            return new Equality(variable.value, value.value);
        } else {
            return this.evaluateMultiplier(expression);
        }
    }
    evaluateMultiplier(expression)
    {   if (expression instanceof Variable) {
            let variable = expression.symbol.value;
            
            if (variable in this.variables) {
                let result = this.variables[variable];

                return new NumberVariable(result);
            } else {
                throw `${variable} on line ${this.counter + 1} is not defined!`
            }
        } else {
            if (expression instanceof NumberConstant) {
                
                return new NumberVariable(expression.symbol.value);
            } else {
                throw 'Variable or Number Constant expected.';
            }
        }
    }

};
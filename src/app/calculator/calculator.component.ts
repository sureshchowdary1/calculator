import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  stack: string = '';
  prevTotal = 0;
  totalNumber = 0;

  constructor() {

  }

  ngOnInit() {
  }

  public async updatevalue(value: string) {
    await this.appendValue(value);
    await this.updatestack();
  }

  public async doCalculation() {
    let expression: any = this.stack;
    const operators: any[] = [];
    const operands: any[] = [];

    const priority: any = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '%': 2,
    };

    const performOperation = () => {
      const operator = operators.pop();
      const operand2 = operands.pop();
      const operand1 = operands.pop();

      switch (operator) {
        case '+':
          operands.push(operand1 + operand2);
          break;
        case '-':
          operands.push(operand1 - operand2);
          break;
        case '*':
          operands.push(operand1 * operand2);
          break;
        case '/':
          operands.push(operand1 / operand2);
          break;
        case '%':
          if (operand1) {
            operands.push(operand1 * operand2 / 100);
          } else {
            operands.push(operand2 / 100);
          }
          break;
      }
    };


    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (char === '(') {
        operators.push(char);
      } else if (!isNaN(char)) {
        let num = parseInt(char);

        while (i + 1 < expression.length && !isNaN(expression[i + 1])) {
          num = num * 10 + parseInt(expression[i + 1]);
          i++;
        }

        operands.push(num);
      } else if (char === ')') {
        while (operators.length > 0 && operators[operators.length - 1] !== '(') {
          performOperation();
        }
        operators.pop(); // Remove '(' from the stack
      } else if (priority[char]) {
        while (
          operators.length > 0 &&
          priority[operators[operators.length - 1]] >= priority[char]
        ) {
          performOperation();
        }
        operators.push(char);
      }
    }

    while (operators.length > 0) {
      performOperation();
    }

    this.totalNumber = operands[0];
    return operands[0];
  }

  public async updatestack(event?: Event) {
    if (event) {
      this.stack = (event.target as HTMLInputElement)?.value || '';
    } else {
      this.stack = (document.querySelector('.calculator-input-screen') as HTMLInputElement)?.value || '';
    }
  }

  public clear() {
    this.totalNumber = 0;
    this.stack = '';
  }
  private async appendValue(value: string) {

    let ele = document.querySelector('.calculator-input-screen') as HTMLInputElement;
    // Get the current cursor position
    var cursorPosition: number = ele.selectionStart || 0;

    // Get the text before and after the cursor position
    var textBeforeCursor = ele.value.substring(0, cursorPosition);
    var textAfterCursor = ele.value.substring(cursorPosition);

    // Insert the value at the cursor position
    ele.value = textBeforeCursor + value + textAfterCursor;

    // Move the cursor to the end of the inserted text
    ele.setSelectionRange(cursorPosition + value.length, cursorPosition + value.length);
    ele.focus();
  }
}

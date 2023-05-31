import { Component, OnInit } from '@angular/core';
import { ButtonType } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'calculator';

  isDarkModeActive: boolean = true;
  rotationRadius: number = 0;

  mode: string = 'dark';

  darkModeButtonStyle: { transform?: string } = {
    transform: 'rotate(0deg)'
  }

  buttonList: ButtonType[] = [
    { value: 'AC', type: 'delete-all' },
    { value: '%', type: 'operator' },
    { value: 'n', type: 'operator' },
    { value: '/', type: 'operator' },
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: '*', type: 'operator' },
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: '-', type: 'operator' },
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '+', type: 'operator' },
    { value: '0', type: 'number', class: 'zero' },
    { value: '.', type: 'number' },
    { value: '=', type: 'equal' },
  ];

  firstNumber: string | number = '';
  secondNumber: string | number = '';
  operator: string = '';
  isOperatorUsed!: boolean;
  sum: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.addKeyboardListenerToCalculator();
  }

  //
  animateDarkMode() {
    this.isDarkModeActive = !this.isDarkModeActive;
    this.rotationRadius += 180;

    setTimeout(() => {
      this.darkModeButtonStyle.transform = `rotate(${this.rotationRadius}deg)`;
    }, 0);


    if (!this.isDarkModeActive) {
      this.mode = 'bright';
    } else if (this.isDarkModeActive) {
      this.mode = 'dark'
    }
  }

  //
  addKeyboardListenerToCalculator() {
    let keys: { [key: number]: number | string } = {};

    for (let i = 49; i < 49 + 9; i++) {
      keys[i] = i - 48
    }

    keys[8] = 'C';

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      const value: ButtonType = this.buttonList.find((button: ButtonType) => button.value == keys[e.keyCode])!;
      if (value) {
        this.handleButtons(value);
      }
    })
  }

  //
  handleButtons(button: ButtonType) {
    if (button.type === 'number' || button.type === 'operator') {
      if (this.firstNumber === '' && button.type !== 'number') {
        return;
      } else if (button.type === 'operator') {

        if (button.value === 'n' && this.secondNumber !== '') {
          return
        }

        this.operator = button.value;
        this.isOperatorUsed = true;
      } 
      else if (!this.isOperatorUsed) {
        this.firstNumber += button.value;

      } else if (this.isOperatorUsed) {
        this.secondNumber += button.value;
      }
    } 
    
    else {
      this.handleDeleteOperator(button);
    }
  }


  //
  handleDeleteOperator(button: ButtonType) {
    if (button.type === 'delete-all') {
      this.resetCalculator();
    } else if (button.type === 'equal') {
      this.handleEquation();
    }
  }

  //
  handleEquation() {
    if (this.operator !== 'n') {
      if (this.firstNumber === '' || this.operator === '' || this.secondNumber === '') {
        return
      }
    }

    this.firstNumber = +this.firstNumber;
    this.secondNumber = +this.secondNumber
    
    if (this.operator === '+') {
      this.sum = this.firstNumber + this.secondNumber;
    } else if (this.operator === '-') {
      this.sum = this.firstNumber - this.secondNumber;
    } else if (this.operator === '*') {
      this.sum = this.firstNumber * this.secondNumber;
    } else if (this.operator === '/') {
      this.sum = this.firstNumber / this.secondNumber;
    } else if (this.operator === '%') {
      this.sum = (this.secondNumber * 100) / this.firstNumber;
    } else if (this.operator === 'n') {
      this.sum = this.firstNumber * this.firstNumber;
    }

    this.operator = '';
    this.isOperatorUsed = false;
    this.firstNumber = this.sum;
    this.secondNumber = '';
  }

  //
  resetCalculator() {
    this.firstNumber = '';
    this.secondNumber = '';
    this.operator = '';
    this.isOperatorUsed = false;
    this.sum = 0;
  }

  //
  assignMarginsToOperators(value: string) {
    let validator;
    const numbers: { [key: number]: number } = {};

    for (let i = 0; i <= 9; i++) {
      numbers[i] = i;
    }

    if (numbers[+value]) {
      return
    } else {
      validator = true;
    }

    return validator;
  }
}

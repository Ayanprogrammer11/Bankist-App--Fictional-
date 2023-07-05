'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnSaveSession = document.querySelector('.save-session');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let user;
let currUserMov;
// Login Functionality
btnLogin.addEventListener('click', function (e) {
  // Preventing the form from submitting
  e.preventDefault();
  // Selecting inputted Username and Pin
  const username = inputLoginUsername.value;
  const pin = Number(inputLoginPin.value);
  // Find account if it doesnt exist then exit execution of this callback function.
  user = accounts.find(acc => acc.username === username && acc.pin === pin);
  if (!user) {
    containerApp.style.opacity = 0;
    return null;
  }
  currUserMov = [...user.movements];
  // Clearing Input Fields, and displaying welcome message
  inputLoginPin.value = '';
  inputLoginUsername.value = '';
  labelWelcome.textContent = `Welcome back, ${user.owner.split(' ')[0]}`;
  // Updating Interface and removing focus from input fields.
  updateUI(user);
  containerApp.style.opacity = 1;
  inputLoginPin.blur();
});

// Transfer Money Functionality
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  //  Select Elements
  const toRecipient = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = Number(inputTransferAmount.value);

  inputTransferTo.value = inputTransferAmount.value = '';
  if (user.balance >= amount && toRecipient && amount > 0 && user?.username !== toRecipient?.username) {
    console.log('valid transfer');
    // Doing the transfer
    user.movements.push(-amount);
    toRecipient.movements.push(amount);
    // Updating the UI
    updateUI(user);
  }
});

// Loan Functionality
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  // 1. Selecting Elements
  const loan = Number(inputLoanAmount.value);
  // 2. Any deposit > 10% of loan?
  const check = user.movements.some(mov => mov > 0 && mov >= loan * 0.1);

  if (check) {
    // 3. Add Positive Movement to current user
    user.movements.push(loan);
    // 4. Update the UI
    updateUI(user);
  }
  // 5. Clearing Input Fields
  inputLoanAmount.value = '';
});

// Deleting Account Functionality
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //  Selecting Elements
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  const index = accounts.findIndex(acc => acc.username === username);

  // Correct Credentials?
  if (user.username === username && user.pin === pin && username === user.username) {
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
    // Clear Inputs
    inputCloseUsername.value = inputClosePin.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(user, !sorted);
  sorted = !sorted;
});

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const displayMovements = function ({ movements }, sorted = false) {
  containerMovements.innerHTML = '';
  const movs = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
};

const calcDisplaySummary = function ({ movements, interestRate }) {
  const incomes = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = movements
    .filter(mov => mov > 0)
    .map(interest => (interest * interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest}€`;
  return { incomes, out, interest };
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Array Methods:

/*
slice: (Mutation: False) This method returns a new sliced array.

splice: This method mutates (changes) the original array and returns the extracted part (like in slice), whereas the original array itself is mutated and the extracted part is gone in the original array

reverse: (Mutation: True) This method reverses an array

concat: (Mutation: False) This method receves one argument to concat the array with

at: The at() method of the array which was introduced in ES2022 does the exact same thing as the bracket notation ([]) to access individual elements in an array.
*/

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

console.warn('Slice Method starting here!');

console.log(arr.slice(2)); // ['c', 'd', 'e']
console.log(arr.slice(0)); // To create a shallow copy: Method 1
console.log([...arr]); // An Alternatve Method 2

// The negative index starts to count from the end
// NOTE: The Last specified index is not counted
console.log(arr.slice(1, -2)); // ['b', 'c']
console.log(arr.slice(-2)); //  = arr.slice(-2, 0) = ['d', 'e']

console.warn('Splice Method starting here');

console.log(arr.splice(2), arr); // ['c', 'd', 'e'] ['a', 'b']

// We can use the splice method to also delete the last element

arr.splice(-1);
console.log(arr);

console.warn('Reverse method starting here');

arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse(arr2), arr2);

console.warn('Concat Method starting here!');

const letters = arr.concat(arr2);
console.log('Returned Value:', letters, 'Original Array:', arr);




//  The at() method of the array which was introduced in ES2022 does the exact same thing as the bracket notation ([]) to access individual elements in an array

// The main thing that distinguishes it from the bracket notation is the easiness of getting last element and writing negative indexes directly

const nums = [20, 40, 60, 80, 100];

// Traditional Approaches:

console.log(nums[nums.length - 1]);
console.log(nums.slice(-1)[0]);

// Using at() method:
console.warn('At Method starting here!')
console.log(nums.at(-1));

// It also works with strings

console.log('Ayan'.at(-1));




// The forEach() method to loop over arrays

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

movements.forEach(function (mov, i, arr) {
  if (mov > 0)
    console.log(
      `Movement ${i + 1}: You deposited ${mov} out of your ${
        arr.length
      } transaction(s)`
    );
  else
    console.log(
      `Movement ${i + 1}: You withdrew ${Math.abs(mov)} out of your ${
        arr.length
      } transaction(s)`
    );
});

// Behind the scenes the Higher-order method (forEach) receives a callback function and it is executed by the forEach method on each teration, in each iteration the current element, current index, and the entire array is passed into the callback function as an argument that we can access.

// 0: function(200, 0, movements)
// 1: function(450)
// ...

// Writing forEach function customly (Just for fun)

const forEach = function (callback, array) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
};

forEach(function (movement) {
  if (movement > 0) console.log(`You deposited ${movement}`);
  else console.log(`You withdrew ${Math.abs(movement)}`);
}, movements);



// Coding Challenge #1

const checkDogs = function (dogsJulia, dogsKate) {
  const juliaCorrected = dogsJulia.slice(0, 1).slice(-2);
  const katesData = dogsKate;
  const allData = [...juliaCorrected, ...katesData];
  allData.forEach(function (dog, i) {
    dog >= 3
      ? console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`)
      : console.log(`Dog number ${i + 1} is still a puppy🐶`);
  });
};

checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);


// The map() method takes a callback function as its first argument and executes it on each iteration in the array. The order and functionality of arguments  passed on each iteration is same as in forEach method.
// The fundamental differencnes between them is that map returns a NEW array.

const euroToUsd = 1.1;
const movementsToUsd = movements.map(mov => mov * euroToUsd);

console.log(movementsToUsd);

// Using for-of loop

// const movementsToUsdfor = [];
// for (const movement of movements) movementsToUsdfor.push(movement * euroToUsd);

// console.log(movementsToUsdfor);

// const arr = [3, 6, 4, 9, 2, 1];

// const solution = arr.map((_, i) => {
//   return arr[i] + (i + 1 === arr.length ? null : arr[i + 1]);
// });

// console.log(solution);
//

// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescription);

// The filter method takes the same arguments as in the map method, The main difference is that we return a BOOLEAN condition, rather than code, though we can write code other than BOOLEAN in it but the returned value should be a BOOLEAN, if the BOOLEAN result is true then the current element that is being iterated will be filtered out to put it into a new array. (Behind the scenes mechanism is same)

// It simply returns a new array with the specified condition in there.

const deposits = movements.filter(function (mov, i) {
  return mov > 0;
});

console.log(deposits);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

*/

// The reduce method takes 4 arguments, with the difference that the first argument is a accumulator and the rest are same according to pattern. It iterates through arrays and return a SINGLE value ratehr than a new array. A accumulator is just like a Snowball that keeps on adding on each iteration.

// const balance = movements.reduce(function (acc, mov) {
//   return acc + mov;
// }, 0);

// console.log(balance);

// // Maximum Value

// const max = movements.reduce(
//   (acc, val) => (acc < val ? (acc = val) : acc),
//   movements[0]
// );

// console.log(max);

// Coding Challenge #2

// const calcAverageHumanAge = function (ages) {
//   // const humanAges = ages.map(age => (age > 2 ? 16 + age * 4 : 2 * age));
//   // const adults = humanAges.filter(age => age >= 18);
//   // const average = adults.reduce((acc, age, i, arr) => {
//   //   return acc + age / arr.length;
//   // }, 0);
//   // return average;

// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// Coding Challenge #3
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age > 2 ? 16 + age * 4 : 2 * age))
//     .filter(age => age >= 18)
//     .reduce((acc, age, _, arr) => acc + age / arr.length, 0);

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));

// The find method takes a BOOLEAN value like the filter mwthod, but the fundamnetal difference is as follows:

// 1. It returns the first found element rather than returning all elements matching the condition.
// 2. It returns a single element not an array

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);
/*
const checkSame = arr => {
  let same = false;
  for (let i = 0; i < arr.length; i++) {
    if (i !== 0) {
      if (arr[i] === arr[i - 1]) same = true;
      else same = false;
    }
  }
  return same;
};

console.log(checkSame([5, 5, 5]));

*/

// The Some and Every Methods

// It checks for the exact equality in each item of an array
// console.log(movements, movements.includes(-130));

// // But the 'some' method is more useful when we need to specify a condition
// // The 'some' method takes the same arguments as in forEach, map, filter etc.. (NOT reduce). On each iteration if atleast one of the specified returned condition in the callback function matches the current item of array in an iteration then it returns true
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// Every does the opposite it returns true if all elements in an array matches the returned condition.

// Flat and FlatMAP

// The Flat method simply flattens an array which contains array, so to spread out all value.

// const arr = [[1, 2, 3, 4], [5, 6, 7, 8], 9, 10];
// console.log(arr.flat());

// const flattenArray = arr => {
//   let result = [];
//   const loopArr = arr => {
//     for (let i = 0; i < arr.length; i++) result.push(arr[i]);
//   };
//   for (let i = 0; i < arr.length; i++) {
//     if (Array.isArray(arr[i])) loopArr(arr[i]);
//     else result.push(arr[i]);
//   }
//   return result;
// };

// console.log(flattenArray(arr));

// const accountMovements = accounts.map(acc => acc.movements);

// console.log(accountMovements.flat());
// const balance = accountMovements.flat().reduce((acc, val) => acc + val, 0);
// console.log(balance);

// There are many sorting algorithms out there, that some of them are complex, but Javascript provides us built-in functions to do sorting to make our life easier. But probably that will not happen when you are working with a low-level language, we would have to implement it from scratch or use others code etcc...

// The sort method is by default designed to work with strings in an alphabetical order. we simply call it on array of strings and it sort them alphabetically
// NOTE: The 'sort' method mutates the original array, so be careful with using it!

// const owners = ['Jonas', 'Zack', 'Martha', 'Ayan'];
// console.log(owners.sort(), owners);

// The 'sort' method unfortunately, is not designed to sort numbers.
// Though we can pass a callback function to it with two arguments: a and b
// The first argument is the element with the current iteration (n). and the second argument is (n + 1)

// return > 0 B, A (switch order)
// return < 0 A, B (keep order)

// This is for sorting in ascending order, for descending we would do the opposite with the comparison operators.
/*
movements.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});

/*

// As the 'sort' method mutates the original array so no need to store it in a variable.
console.log(movements);

// Descending
/*
movements.sort((a, b) => {
  if (a > b) return -1;
  if (a < b) return 1;
});
console.log(movements);
*/

// Instead of writing this code, we can simply return a value like a - b for ascending, now if a < b then it will be negative and the orders will be  NOT switched, and vice versa (b - a) for descending

// Ascending
/*
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
movements.sort((a, b) => b - a);
console.log(movements);
*/

// In a scenario where an array consists of numbers and strings BOTH, then its not going to work, and in that case don't use the 'sort' method for sorting. And logically there is no point to do so.


// check
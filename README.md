### 1. What is the difference between var, let, and const?
- var: it is  function scoped and it can be redeclared. This is an old way of declaring a variable.It can be reassigned later

- let: It is block scoped. It cannot be redeclared in the same scope. This is a modern way of declaring a variable.It also can be reassigned later.

- const: it is block scoped and must be assigned a value immediately. This is a modern way of declaring a variable. It cannot be reassigned later.

### 2. What is the difference between map(), filter(), and forEach()?
- 1. forEach() : It is usually used when we want to do something for every item or to perform any action to every item. it returns nothing (undefined).
- 2. map() : we usually use this when we want to transform every item of an array into something else. it returns a new array with the exact same length of the original one. 
Example : if we want to square every element of an array, we can easily solve that problem with that.
- 3. filter() : it is usually used when we want to select specific items based on a condition. it returns a new array which is usually shorter than the original one.


### 3. What is the spread operator (...)?
- spread operator is used to expand elements of an array or properties of an object into individual elements. it makes easier to copy or manipulate any data of that array or object.


### 4. What is an arrow function?
- an arrow function is a type of function which provides a more concise way to write a function.
- generally we write an arrow function with (=>).


### 5. What are template literals?
- Template literals are a kind of strings which allow embadded expressions with "${}" . it makes the string creation more flexible and readable.
- we use (``)backticks to identify the template literals.
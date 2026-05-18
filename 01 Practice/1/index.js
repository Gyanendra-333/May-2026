// sayHello(); // TypeError

// var sayHello = function () {
//     console.log("Hello");
// };



// let globalName = "Global";

// function outer() {
//     let outerName = "Outer";

//     function inner() {
//         let innerName = "Inner";
//         console.log(outerName);
//         console.log(globalName);
//         console.log(innerName);
//     }

//     inner();
// }

// outer();



function counter() {
    let count = 0;

    return function () {
        count++;
        return count;
    };
}

const increment = counter();

console.log(increment());
console.log(increment());
console.log(increment()); 
function random(resolve) { // resolve is the function 
    let a = 7;
    let b = 10;
    function fn() {
        console.log('area is : ');
        console.log(a * b);
        resolve(); // resolve the promise
    }
    setTimeout(fn, 3000);
}

let p = new Promise(random); // suppose to return eventually

function callback() {
    console.log('promise resolved after 3 sec');
}

p.then(callback);

console.log(p);
setTimeout(() => console.log("checking whether promise is resolved: ", p), 3000);
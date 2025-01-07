// function callback(){
//     console.log('some time has passed');
// }
// console.log('before 3 sec');

// setTimeout(callback,3000)

// console.log('again before 3 sec i guess');



function settimeoutpromisified(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function threesec() {
    console.log('3 sec passed');

}
settimeoutpromisified(3000).then(threesec);
console.log(settimeoutpromisified(3000));


function promisecallback(fn) {
    setTimeout(fn, 3000)
}
function main() {
    console.log("3 sec ho gya");
}

promisecallback(main)


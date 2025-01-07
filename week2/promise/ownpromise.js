const { resolve } = require("path");

class promise2 {
    constructor(fn) {
        function afterdone(){
            this.resolve();
        }
        fn(afterdone);
    }
    
    then(callback) {
        this.resolve = callback;
    }
}

function Readthefile(resolve) {
    setTimeout(function () {
        console.log("Read the file is called");
       resolve();
    }, 3000);
}

let p = new promise2(Readthefile);
function callback() {
    console.log('callback is called after 3 sec');
}
p.then(callback);

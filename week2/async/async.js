import fs from "fs";

// const content = fs.readFileSync("b.txt","utf-8");
// console.log(content);


// const suraj = fs.readFileSync("a.txt","utf-8");
// console.log(suraj);

// 
// asynchronous file operation

fs.readFile("a.txt","utf-8",(err,data)=>{
    console.log(data);
});

console.log('done');


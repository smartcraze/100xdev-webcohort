class rectangle{
    constructor(height, width, color){
        this.height = height;
        this.width = width;
        this.color = color;
    }
    area(){
        return this.height * this.width;
    }
    perimeter(){
        return 2 * (this.height + this.width);
    }
    printColor(){
        console.log(`The color of the rectangle is ${this.color}`);
        
    }
}

const obj = new rectangle(10, 20, 'red');
console.log(obj.area());
console.log(obj.perimeter());
obj.printColor();


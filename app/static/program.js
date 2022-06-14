//checklist
//implement all the rabbit variables
//winter summer button
//hawk function 
//reproduction
//graphs
//more user inputs
//pause & speed up buttons
//reset button


let isrunning = false

class Rabbit{
    constructor(x,y,colour){
        this.colour=colour; //0-15, 4bits colours are cool but hard to graph?
        this.diameter=40; //0-63, 6bits 
        this.energygain=3; //0-31, 5bits use has barrier fo reproduction?
        this.intelligence=15; //0-15, 4bits 
        this.speed=10; //0-15, 4bits not implemented
        this.dna=this.getdna() //23 total bits
        this.hunger=100
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.offset=Math.floor(Math.random() * 9);
    }
    getdna(){
        let c = this.colour.toString(2);
        c = '0000'.substr(c.length) +c;
        let d = this.diameter.toString(2)
        d = '000000'.substr(d.length) +d;
        let e = this.energygain.toString(2)
        e = '00000'.substr(e.length) +e;
        let i = this.intelligence.toString(2)
        i = '0000'.substr(i.length) +i;
        let s = this.speed.toString(2)
        s = '0000'.substr(s.length) +s;
        return(c+d+e+i+s)
        }
    update(grass){
        let tempx = this.x
        let tempy = this.y
        let tempd = this.diameter
        let eatflag = 0
        let closest = 1100
        let grassvx = 0
        let grassvy = 0
        grass.forEach(function(item,index,object){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2))
            if(distance <= (tempd/2+18)){
                object.splice(index,1)
                eatflag = 1
            }
            if(distance<closest){
                closest = distance
                if(item.x > tempx){
                    grassvx = 1
                }else if(item.x < tempx){
                    grassvx = -1
                }else{
                    grassvx = 0
                }
                if(item.y > tempy){
                    grassvy = 1
                }else if(item.y < tempy){
                    grassvy = -1
                }else{
                    grassvy = 0
                }
                }
            })

        if (Math.floor((millis()%1000)/100) != this.offset){
            this.vx = Math.floor(Math.random() * 3) - 1
            this.vy = Math.floor(Math.random() * 3) - 1
            if(Math.floor(Math.random() * 16) <= this.intelligence){
                this.vx = grassvx
                this.vy = grassvy
            }
            if(this.x<=25){
                this.vx = 1
            }
            else if(this.x>=965){
                this.vx = -1
            }
            if(this.y<=25){
                this.vy = 1
            }
            else if(this.y>=475){
                this.vy = -1
            }

        } else {
            this.x += this.vx*this.speed
            this.y += this.vy*this.speed
            this.hunger -= 1
        }

        
        if(eatflag){
            this.hunger += 30 + this.energygain
            eatflag = 0
            this.diameter += 5
        }
    }
   
    draw(){
        fill(90+(this.colour*11),15+(this.colour*16),15+(this.colour*16))
        ellipse(this.x, this.y, this.diameter);
    }


    
}

class Grass{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    draw(){
        fill(67,178,40);
        ellipse(this.x, this.y, 40);
    }
}

let rabbits = [];
let grass_patches = [];

function addRabbit(num,white_ratio){
    for (let i = 0; i<num;i++){
        let random = Math.floor(Math.random() * 100);
        if(random > white_ratio){
            rabbits.push(new Rabbit(Math.random() * (970 - 20) + 20,Math.random() * (470 - 20) + 20,15));  
        } else {
            rabbits.push(new Rabbit(Math.random() * (970 - 20) + 20,Math.random() * (470 - 20) + 20,0));
        }
    }
}

function addGrass(num){
    for (let i = 0; i<num;i++){
        grass_patches.push(new Grass(Math.random() * (970 - 20) + 20,Math.random() * (470 - 20) + 20));
    }
}


function start(){
    isrunning = true
    let num_rabbit = document.getElementById("num_rabbit").value;
    let white_ratio = document.getElementById("white%").value;
    addRabbit(num_rabbit,white_ratio);
    addGrass(40);
    document.getElementById("start").disabled =true;
    document.getElementById("num_rabbit").disabled =true;
    document.getElementById("white%").disabled =true;
}
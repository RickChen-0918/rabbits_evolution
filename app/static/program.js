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
    constructor(x,y,dna){
        this.dna= dna.toString() //dna+23bits, so 26bits in total
        this.colour=parseInt(this.dna.slice(3,7),2); //0-15, 4bits
        this.diameter=parseInt(this.dna.slice(7,12),2)+32; //0-31, 5bits 
        this.energygain=parseInt(this.dna.slice(12,17),2); //0-31, 5bits use has barrier for reproduction?
        this.intelligence=parseInt(this.dna.slice(17,21),2); //0-15, 4bits 
        this.speed=parseInt(this.dna.slice(21,25),2); //0-15, 4bits
        this.energy=100
        this.maxsize=this.diameter*1.25
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.offset=Math.floor(Math.random() * 9);
    }

    

    chooseaction(grass){
        //eat, reproduce, move, do nothing
        let tempx = this.x
        let tempy = this.y
        let tempe = this.energy
        let tempd = this.diameter
        grass.forEach(function(item,index,object){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2));
            if(distance <= (tempd/2+18)){
                object.splice(index,1);
                return [1];
            }
        })

        rabbits.forEach(function(item){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2));
            if(distance <= ((tempd/2) + (item.diameter/2))){
                if(tempe > 120 && item.energy > 120){
                    let avg_x = (tempx + item.x)/2
                    let avg_y = (tempy + item.y)/2
                    return [2,avg_x,avg_y,item.dna];
                }
            }
        })

        if (Math.floor((millis()%1000)/100) == this.offset){
            return [3];
        }
        return [4];
    }

    update(grass){
        let closest = 1100
        let action = this.chooseaction(grass)
        let tempx = this.x
        let tempy = this.y
        let grassvx = 0
        let grassvy = 0

        if(action[0] == 1){
            this.energy += 30 + this.energygain
            if(this.diameter < this.maxsize){
                this.diameter += 2
                } 
        }else if(action[0] == 2){
            this.energy -= 120
            let cutoff = Math.floor(Math.random() * 20) + 4
            let newdna = this.dna.slice(3,cutoff) + action[3].slice(cutoff,25)
            rabbits.push(new Rabbit(action[1],action[2],newdna));
        } else if(action[0] == 3){
            this.x += this.vx*(this.speed/4)
            this.y += this.vy*(this.speed/4)
            this.energy -= 0
        } else if(action[0] == 4){
        grass.forEach(function(item){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2))
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

            this.vx = Math.floor(Math.random() * 3) - 1
            this.vy = Math.floor(Math.random() * 3) - 1
            if(Math.floor(Math.random() * 16) <= this.intelligence){
                this.vx = grassvx
                this.vy = grassvy
            }
            if(this.x<=(this.diameter/2)+5){
                this.vx = 1
            }
            else if(this.x>=985-(this.diameter/2)){
                this.vx = -1
            }
            if(this.y<=(this.diameter/2)+5){
                this.vy = 1
            }
            else if(this.y>=985-(this.diameter/2)){
                this.vy = -1
            }   
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

function RandomBinary(){
    let binary = "dna";
    for(let i = 0; i < 22; ++i) {
      binary += Math.floor(Math.random() * Math.floor(2));
        }
    return binary;
}   

function addRabbit(num,white_ratio){
    for (let i = 0; i<num;i++){
        rabbits.push(new Rabbit(Math.random() * (970 - 20) + 20,Math.random() * (470 - 20) + 20, RandomBinary()));  
           
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
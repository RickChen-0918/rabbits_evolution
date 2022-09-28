//checklist
//implement all the rabbit variables
//winter summer button
//hawk function 
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
        this.energygain=parseInt(this.dna.slice(12,17),2); //0-31, 5bits 
        this.intelligence=parseInt(this.dna.slice(17,21),2); //0-15, 4bits 
        this.speed=parseInt(this.dna.slice(21,25),2); //0-15, 4bits
        this.energy=100
        this.maxsize=this.diameter*1.2
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.offset=[Math.floor(Math.random() * 9),Math.floor(Math.random() * 9)];
    }

    chooseaction(grass){
        //eat, reproduce, move, do nothing
        let tempx = this.x
        let tempy = this.y
        let tempe = this.energy
        let tempd = this.diameter
        let tempdna = this.dna
        let action = [4]
        grass.forEach(function(item,index,object){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2));
            if(distance <= (tempd/2+18)){
                object.splice(index,1);
                action = [1];
                
            }
        })

        rabbits.forEach(function(item){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2));
            if(distance <= ((tempd/2) + (item.diameter/2))){
                if(tempe > 110 && item.energy > 110 && item.dna != tempdna){
                    let avg_x = (tempx + item.x)/2
                    let avg_y = (tempy + item.y)/2
                    action = [2,avg_x,avg_y,item.dna];
                }
            }
        })

        this.offset.forEach(function(item){
            if (Math.floor((millis()%1000)/100) == item){
            action = [3];
        }})
        return action;

    }

    update(grass){
        let closest = 1100
        let action = this.chooseaction(grass)
        let tempx = this.x
        let tempy = this.y
        let tempdna = this.dna
        let grassvx = 0
        let grassvy = 0
        let sexvx = 0
        let sexvy = 0
        

        if(action[0] == 1){
            this.energy += 30 + this.energygain*2
            if(this.diameter<this.maxsize){
                this.diameter += 3
            }
        }else if(action[0] == 2){
            this.energy -= 120
            let cutoff = Math.floor(Math.random() * 20) + 4
            let newdna = 'dna' + this.dna.slice(3,cutoff) + action[3].slice(cutoff,25)
            rabbits.push(new Rabbit(action[1],action[2],newdna));
        } else if(action[0] == 3){
            this.x += this.vx*(this.speed/4)+1
            this.y += this.vy*(this.speed/4)+1
            this.energy -= 0.5
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

            rabbits.forEach(function(item){
                let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2))
                if(distance<closest && item.dna != tempdna && item.energy > 150){
                    closest = distance
                    if(item.x > tempx){
                        sexvx = 1
                    }else if(item.x < tempx){
                        sexvx = -1
                    }else{
                        sexvx = 0
                    }
                    if(item.y > tempy){
                        sexvy = 1
                    }else if(item.y < tempy){
                        sexvy = -1
                    }else{
                        sexvy = 0
                    }
                }
            })

            if(this.energy>150){
                this.vx = sexvx
                this.vy = sexvy
            } else if(Math.floor(Math.random() * 16) <= this.intelligence){
                this.vx = grassvx
                this.vy = grassvy
            } 
                    
            if(this.x<=30){
                this.vx = 1
            }
            if(this.x>=960){
                this.vx = -1
            }
            if(this.y<=30){
                this.vy = 1
            }
            if(this.y>=460){
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

let isrunning = false
let paused = false
let rabbit_graphics = [[],[],[],[],[],[],[],[]]
let hawk_graphics = []
let grass_graphics = []


class Rabbit{
    constructor(x,y,dna){
        this.dna=dna.toString() //21bits
        this.colour=parseInt(this.dna.slice(0,3),2); //0-7, 3bits
        this.size=parseInt(this.dna.slice(3,8),2)+50; //0-31, 5bits 
        this.energygain=parseInt(this.dna.slice(8,13),2); //0-31, 5bits 
        this.intelligence=parseInt(this.dna.slice(13,17),2); //0-15, 4bits 
        this.speed=parseInt(this.dna.slice(17,21),2)+1; //1-16, 4]bits
        this.energy=110
        this.maxsize=this.size*1.2
        this.x=x; //x coordinate
        this.y=y; //y coordinate
        this.vx=0; //horizontal velocity
        this.vy=0; //vertical velocity
        this.offset=[Math.floor(Math.random() * 9),Math.floor(Math.random() * 9)]; //movement timing offset
        this.alive=true;
        this.targeted=false;
        this.img = rabbit_graphics[this.colour];
    }

    chooseaction(grass){
        //eat, reproduce, move, choose direction
        let tempx = this.x
        let tempy = this.y
        let tempe = this.energy
        let temps = this.size
        let tempdna = this.dna
        let action = [4]

        grass.forEach(function(item,index,object){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2));
            if(distance <= (temps/2)){
                object.splice(index,1);
                action = [1];
                
            }
        })

        rabbits.forEach(function(item){
            let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2));
            if(distance <= ((temps/2) + (item.size/2))){
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
        if(this.energy<=0){
            this.alive=false
            return
        } 

        let closest = 1100
        let action = this.chooseaction(grass)
        let tempx = this.x
        let tempy = this.y
        let tempvx = 0
        let tempvy = 0
        let chance = 0
        

        if(action[0] == 1){ //eat
            this.energy += 30 + this.energygain*2
            if(this.size<this.maxsize){
                this.size += 3
            }
        }else if(action[0] == 2){ //reproduce
            this.energy -= 70
            let cutoff = Math.floor(Math.random() * 21)
            let newdna = this.mutate(this.dna.slice(0,cutoff) + action[3].slice(cutoff,24))
            rabbits.push(new Rabbit(action[1],action[2],newdna));

            print(this.dna,action[3],newdna)
            

        } else if(action[0] == 3){ //move
            this.x += this.vx*(this.speed/4)
            this.y += this.vy*(this.speed/4)
            this.energy -= 0.2
            if(summer){
                chance = this.colour
            } else{
                chance = 7-this.colour
            }
            if(this.targeted==false){
                if(Math.floor(Math.random() * 10000) <= chance){
                    hawks.push(new Hawk(this))
                    this.targeted=true
                }
            }

        } else if(action[0] == 4){ //choose direction
            let result = this.choosedirection(closest,tempx,tempy,tempvx,tempvy,grass)
            this.vx = result[0] 
            this.vy = result[1]
            if(this.x<30){
                this.vx = 1
            }else if(this.x>960){
                this.vx = -1 
            }
            if(this.y<30){
                this.vy = 1
            }else if(this.y>460){
                this.vy = -1 
            }
                
            
        }
    }
    
    choosedirection(closest,tempx,tempy,tempvx,tempvy,grass){
        if(this.energy>150){
            rabbits.forEach(function(item){
                let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2))
                if(distance<closest){
                    closest = distance
                    if(item.x > tempx){
                        tempvx = 1
                    }else if(item.x < tempx){
                        tempvx = -1
                    }else{
                        tempvx = 0
                    }
                    if(item.y > tempy){
                        tempvy = 1
                    }else if(item.y < tempy){
                        tempvy = -1
                    }else{
                        tempvy = 0
                    }
                }
            })
        }else if(Math.floor(Math.random() * 15) <= this.intelligence){
            grass.forEach(function(item){
                let distance = Math.sqrt(Math.pow((tempx-item.x),2) + Math.pow((tempy-item.y),2))
                if(distance<closest){
                    closest = distance
                    if(item.x > tempx){
                        tempvx = 1
                    }else if(item.x < tempx){
                        tempvx = -1
                    }else{
                        tempvx = 0
                    }
                    if(item.y > tempy){
                        tempvy = 1
                    }else if(item.y < tempy){
                        tempvy = -1
                    }else{
                        tempvy = 0
                    }
                }
            })
        }else{
            tempvx = Math.floor(Math.random() * 3) - 1
            tempvy = Math.floor(Math.random() * 3) - 1
        }
        return [tempvx,tempvy]
    }

//takes in a binary number and randomly flips a certian number of bits based on the mutation rate
    mutate(dna) {  
        let mut_dna = "";
        let mut_rate = document.getElementById("mutation_rate").value;
      
        for (let i = 0; i < dna.length; i++) {
          if (Math.random() < 0.2 || mut_rate <= 0) {
            mut_dna += dna[i];
          } else {
            mut_dna += dna[i] === "0" ? "1" : "0";
            mut_rate--;
          }
        }
      
        return mut_dna;
      }      

    draw(){
        //fill(90+this.colour*(255-90)/7, 15+this.colour*(255-15)/7, 15+this.colour*(255-15)/7);
        //ellipse(this.x, this.y, this.size)
        image(this.img[0],this.x-38,this.y-25,this.size,this.size*0.6);
}
}

class Hawk{
    constructor(target){
        this.target=target;
        this.x=this.target.x+this.target.y+40;
        this.y=-40;
        this.speed=4    ;
        this.colour=this.target.colour;
        
    }
    update(){
        if(rabbits.includes(this.target)){
            if(this.x>this.target.x){
                this.x-=this.speed
            }else if(this.x<this.target.x){
                this.x+=this.speed
            }
            if(this.y>this.target.y){
                this.y-=this.speed
            }else if(this.y<this.target.y){
                this.y+=this.speed
            }
            let distance = Math.sqrt(Math.pow((this.x-this.target.x),2) + Math.pow((this.y-this.target.y),2));
            if(distance <= (20)){
                this.target.alive=false
            }
        } else{
            this.x -= this.speed
            this.y -= this.speed
        }
    }

    draw(){
        //fill(30, 73, 120);
        //ellipse(this.x, this.y, 40);
        if(rabbits.includes(this.target)){
            image(hawk_graphics[8],this.x-50,this.y-50,75,75)
        }else{
            image(hawk_graphics[this.colour],this.x-50,this.y-50,75,75)
        }
    }
}

class Grass{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.img=Math.floor(Math.random() * 4);
    }
    draw(){
        //fill(67,178,40);
        //ellipse(this.x, this.y, 40);
        if(summer){
            image(grass_graphics[this.img],this.x-38,this.y-38)
        }else{
            image(grass_graphics[this.img+4],this.x-38,this.y-38)
        }
        
    }
}

let rabbits = [];
let grass_patches = [];
let hawks = [];

function LoadGraphics(){
    let labels = ["_A_L","_A_R","_B_L","_B_R","_C_L","_C_R"]
    for (let i = 0; i<8;i++){
        hawk_graphics.push(loadImage("http://127.0.0.1:5000/graphics/hawks/hawk_"+i+".png"))
        grass_graphics.push(loadImage("http://127.0.0.1:5000/graphics/grass/grass_"+i+".png"))
        for (let k = 0; k<6;k++){
            temp_img = loadImage("http://127.0.0.1:5000/graphics/rabbits/rabbit_"+i+labels[k]+".png");
            rabbit_graphics[i].push(temp_img) 
        }
    }
    hawk_graphics.push(loadImage("http://127.0.0.1:5000/graphics/hawks/hawk_base.png"))

}

function RandomBinary(){
    return Math.floor(Math.random() * Math.pow(2, 21)).toString(2).padStart(21, "0");
}   

function addRabbit(num){
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
    document.getElementById("num_rabbit").disabled =true;
    document.getElementById("mutation_rate").disabled =true;
    document.getElementById("start").disabled =true;
    addRabbit(num_rabbit);
    addGrass(40);
}

function halt(){ //called when the pause/unpasue button is pressed
    isrunning = !isrunning
    paused = !paused
}

function clearance(){ //called when the reset button is pressed
    isrunning = false
    paused = false
    rabbits = []
    grass_patches = []
    hawks = []
    myLineChart.data.labels = []
    myLineChart.data.datasets[0].data = []
    myLineChart.reset();
    myBarChart.data.datasets[0].data = [0,0,0,0,0,0,0,0]
    myLineChart.update();
    myBarChart.update();
    document.getElementById("num_rabbit").disabled =false;
    document.getElementById("mutation_rate").disabled =false;
    document.getElementById("start").disabled =false;
}



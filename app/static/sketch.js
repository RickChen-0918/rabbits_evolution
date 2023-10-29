let bg_summer;
let bg_winter;

function setup(){
    bg_summer = loadImage("http://127.0.0.1:5000/graphics/grass_background.png")
    bg_winter = loadImage("http://127.0.0.1:5000/graphics/winter_background.png")
    LoadGraphics()
    print(rabbit_graphics,grass_graphics,hawk_graphics)
    createCanvas(990,490)
}
counter = 0

function draw(){
    if(summer){
        background(bg_summer); 
    }else{
        background(bg_winter); 
    }
    
    for (let i = 0; i<rabbits.length;i++){
        rabbits[i].draw()
    }
    for (let i = 0; i<grass_patches.length;i++){
        grass_patches[i].draw()
    }
    for (let i = 0; i<hawks.length;i++){
        hawks[i].draw()
    }

    if (isrunning){
        rabbits.forEach(function(item,index,object){
            if(item.alive==false){
                object.splice(index,1)
            }
        })
        hawks.forEach(function(item,index,object){ 
            if(item.x<=-40 || item.y<=-40){
                object.splice(index,1)
            }
        })

        for (let i = 0; i<rabbits.length;i++){
            rabbits[i].update(grass_patches)
        }
        for (let i = 0; i<hawks.length;i++){
            hawks[i].update()
        }
        if(counter%250 == 0){
            addGrass(10)
        }
        
        counter+=1
    }
}

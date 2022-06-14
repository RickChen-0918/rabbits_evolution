function setup(){
    createCanvas(990,490)
}
counter = 0
function draw(){
    background(220);
    
    if (isrunning){
        rabbits.forEach(function(item,index,object){
            if(item.hunger<=0){
                object.splice(index,1)
            }
        })
        for (let i = 0; i<rabbits.length;i++){
            rabbits[i].update(grass_patches)
            rabbits[i].draw()

        }
        for (let i = 0; i<grass_patches.length;i++){
            grass_patches[i].draw()
        }
        
        if(counter%250 == 0){
            addGrass(2)
        }
        
        counter+=1
    }
}

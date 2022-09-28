function setup(){
    createCanvas(1500,1000)
}
counter = 0
function draw(){
    background(220);
    
    if (isrunning){
        rabbits.forEach(function(item,index,object){
            if(item.energy<=0){
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
            addGrass(30-rabbits.length)
        }
        
        counter+=1
    }
}

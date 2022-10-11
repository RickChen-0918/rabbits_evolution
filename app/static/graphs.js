 
// this is ugly, don't judge me
var updateData = function(oldData){
  var labels = oldData["labels"];
  var dataSetA = oldData["datasets"][0]["data"];
  var dataSetB = oldData["datasets"][1]["data"];
  
  labels.shift();
  count++;
  labels.push(count.toString());
  var newDataA = dataSetA[9] + (20 - Math.floor(Math.random() * (41)));
  var newDataB = dataSetB[9] + (20 - Math.floor(Math.random() * (41)));
  dataSetA.push(newDataA);
  dataSetB.push(newDataB);
  dataSetA.shift();
  dataSetB.shift();    };
    
var optionsAnimation = {
  //Boolean - If we want to override with a hard coded scale
  scaleOverride : true,
  //** Required if scaleOverride is true **
  //Number - The number of steps in a hard coded scale
  scaleSteps : 10,
  //Number - The value jump in the hard coded scale
  scaleStepWidth : 10,
  //Number - The scale starting value
  scaleStartValue : 0
}

// Not sure why the scaleOverride isn't working...
var optionsNoAnimation = {
  animation : false,
  //Boolean - If we want to override with a hard coded scale
  scaleOverride : true,
  //** Required if scaleOverride is true **
  //Number - The number of steps in a hard coded scale
  scaleSteps : 20,
  //Number - The value jump in the hard coded scale
  scaleStepWidth : 10,
  //Number - The scale starting value
  scaleStartValue : 0
}

var count = 10;
var yValues = population;
var data = {
    labels : xValues,
      datasets : [
        {
              fillColor : "rgba(220,220,220,0.5)",
              strokeColor : "rgba(220,220,220,1)",
              pointColor : "rgba(220,220,220,1)",
              pointStrokeColor : "#fff",
              data : [0]
          }
      ]
}


//Get the context of the canvas element we want to select
var ctx = document.getElementById("myChart").getContext("2d");
var optionsNoAnimation = {animation : false}
var myNewChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: "rgba(0,0,0,1)",
          borderColor: "rgba(0,0,0,0.1)",
          data: yValues
        }]
      },
      options:{
        responsive: true,
        scales: {
          y: {
              min: 0,
              max: 20,
              // ticks: {
              //     stepSize: 0.5
              // }
          }
      }}});
// myNewChart.Line(data, optionsAnimation);	


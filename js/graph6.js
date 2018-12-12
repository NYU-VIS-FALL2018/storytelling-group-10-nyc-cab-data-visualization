$(document).ready(function(){
  
	width = $('#graph6').width();
	height = $('#graph6').height();
	//drawGraph6(width, height);
});


function drawGraph6(width, height){
    console.log("in function ")
	var svg = d3.select("#graph6") // set the width, height and color of the background
        ;
        var dict = {
            "Brooklyn": [-74.0, 40.6],
            "Manhattan": [-74, 40.8],
            "Staten Island": [-74.3, 40.6],
            "Bronx": [-74.0, 40.8],
            "Queens": [-74.0, 40.7],
            true:  [-74.0, 40.7]
          };
          if(angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup == "ALL")
            pickup_Data = true;
        else{
            pickup_Data= angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup;
        }     
    var projection = d3.geoMercator()  // set the map projection
        .scale(65000).center(dict[pickup_Data])  // these values will change depending on the region you want the map to show
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()  // create a function to convert your map's coordinates to an svg path
        .projection(projection);
    
    d3.json("dataset/nyctaxipickups.geojson", function(error, nyctaxis) {  //load the geojson file
        if (error) throw error;
        var max = 0;
        
        var colorScale = d3.scaleLinear().domain([1,max])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("green"), d3.rgb('red')]);
        // **** CREATE THE MAP ****
        var mymap = svg.selectAll("anystring")  // For these purposes, what goes here is irrelevant
            .data(nyctaxis.features) // The features from your geojson file
            .enter()
            .filter(function(d){
                if (pickup_Data == true)
                    return true;
                return d.properties["BoroName"] == pickup_Data
            })
            .append("path").attr("d", path)
            .style("fill",function(d){ // set the colors of each feature
                var pickupsInHour0 = d.properties["hour0"]; // You can reference any of your map's attributes in this way
                // console.log(pickupsInHour0 / 100);
                var temp = Math.log(pickupsInHour0) + 1
                if (temp > max)
                    max = temp
                return colorScale(temp); // Viridis is one of D3's built in color ramps. More here: https://github.com/d3/d3-scale#interpolateViridis
            });
        console.log("max value is ", max);
        
        var displayHour = svg.append("text") // display the current hour
            .attr("x",30)  // position the text box on the screen. Coordinate [0,0] is the upper left corner.
            .attr("y",30)
            .style("fill","white")
            .text("Hour : 0")
            .style("font-size", "20px")
         
        // **** ANIMATE THE MAP'S COLORS ACCORDING TO THE HOURLY NUMBER OF PICKUPS ****
        var hour = 0;
        setInterval(function(){
            hour = (hour + 1) % 24;  // increment the hour
            
            mymap // change the colors smoothly
                .transition()
                .duration(1000)
                .filter(function(d){
                    if (pickup_Data == true)
                        return true;
                    return d.properties["BoroName"] == pickup_Data;
                })    
                .style("fill",function(d){
                    var pickupsThisHour = d.properties["hour" + hour];
                    return colorScale(Math.log(pickupsThisHour) + 1);
                });
            
            displayHour.text("Hour : " + hour); // display the updated hour
        },1000); // repeat this function every second
        
    });
}
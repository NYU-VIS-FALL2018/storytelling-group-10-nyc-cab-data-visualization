
$(document).ready(function(){
    heatmap()
});

heatmap = function(){
    
	var margin = { top: 50, right: 0, bottom: 100, left: 30 },
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize*2,
    buckets = 9,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    // days = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"]
    times = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
    datasets = ["dataset/final_project_data.csv"];

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .style("fill", "black")
    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", function(d, i) { return i * gridSize; })
    .attr("y", 0)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

var heatmapChart = function() {
d3.csv("dataset/final_project_data.csv",
function(error, csv_data) {
    if (error) throw error;
    var pickup_location = angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup;
    var drop_location = angular.element(document.querySelector('[ng-controller="myController"]')).scope().dropOff;    

    if( pickup_location != "ALL" && drop_location != "ALL")
        csv_data = csv_data.filter(function(d) { return (d.Source_Borough  == pickup_location && d.Drop_Borough  == drop_location);});
    else if( pickup_location != "ALL"){
        csv_data = csv_data.filter(function(d) { return d.Source_Borough  == pickup_location;});
    }
    else if( drop_location != "ALL"){
        csv_data = csv_data.filter(function(d) { return d.Drop_Borough  == drop_location;});
    }

    inputdata = csv_data.map(element => {
        return {
            day: +((element.Date.split("/")[1]%7)+1),
            hour: +element.Hour,
            value: +element.Count_of_rides/100
            };
    });
    var dataGroupedByDay = d3.nest()
    .key(function(d) {return Number(d.day);})
    .key(function(d) {return Number(d.hour);})
    .rollup(function(d) {
      return d3.mean(d, function(g) {return g.value;});
    }).entries(inputdata);

    var data = []
    for (var dayelement in dataGroupedByDay)
    {
        for (var hourelement in dataGroupedByDay[dayelement].values)
        // console.log(hourelement)
        data.push({
            day: dataGroupedByDay[dayelement].key,
            hour: dataGroupedByDay[dayelement].values[hourelement].key,
            value: dataGroupedByDay[dayelement].values[hourelement].value
        })
    }
    console.log(data)
    // var colorScale = d3.scaleQuantile()
    //     .domain([0, buckets - 1, d3.max(data, function (d) { return Math.log2(d.value); })])
    //     .range(colors);
    var max = d3.max(data, function (d) { return d.value; });
    var min = d3.min(data, function(d){return d.value})
    var colorScale = d3.scaleLinear().domain([max, min])
    .range([d3.rgb("#0f3443"), d3.rgb("#34e89e")]);

    var cards = svg.selectAll(".hour")
        .data(data, function(d) { return d.day+':'+d.hour;});

    cards.append("title");

    cards.enter().append("rect")
        .attr("x", function(d) { return (d.hour - 1) * gridSize + 45; })
        .attr("y", function(d) { return (d.day - 1) * gridSize; })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("class", "hour bordered")
        .attr("width", gridSize)
        .attr("height", gridSize)
        .style("fill", function(d) { return colorScale(d.value);})
        .style("fill", function(d) {return colorScale(d.value);});

    cards.transition().duration(1000)
        .style("fill", function(d) { return colorScale(d.value); });

    cards.select("title").text(function(d) { return d.value; });
    
    cards.exit().remove();

    var legend = svg.selectAll(".legend")
        .data([0].concat(colorScale), function(d) { return d; });

    legend.enter().append("g")
        .attr("class", "legend");

    legend.append("rect")
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2)
    .style("fill", function(d, i) { return colors[i]; });

    legend.append("text")
    .attr("class", "mono")
    .text(function(d) { return "≥ " + Math.round(d); })
    .attr("x", function(d, i) { return legendElementWidth * i; })
    .attr("y", height + gridSize);

    legend.exit().remove();

});  
};

heatmapChart();

}


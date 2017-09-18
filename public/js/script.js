// ------------------- MASSEY STARTING HERE -------------------------

// NAMING AND CALLING VARIABLES
var startingYear = 1920,
    endingYear = 1939;

var climateData = [];

// LOOPING AND CALLING THE SAME FUNCTION, THE YEAR INCREMENTS BY 20 TO CHANGE THE URL
// REQUEST.
for (var i = 0; i < 9; i++) {
  getInfo(startingYear, endingYear);
  startingYear += 20;
  endingYear += 20;
}

// GETTING THE INFORMATION FROM THE WORLD BANK DATA API FOR DIFFERENT YEARS
// AND THEN PUSHING EVERYTHING TO THE CLIMATEDATA ARRAY.
function getInfo(startingYear, endingYear){
  $.ajax({
    url: "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/tas/" + startingYear + "/" + endingYear + "/NZL",
    dataType: "json",
    success:function(data){
      // SETTING THE AVERAGE FROM THE TWENTY YEAR TIMELINE AND THE TOTAL AMOUNT
      var currentAverage = 0;
      var total = 0;

      // GETTING THE TEMPERATURE IN NZ FOR EVERY YEAR WITHIN THE 20 YEAR TIMELINE
      for (var i = 0; i < data.length; i++) {
       total += data[i].annualData[0];
      }

      // FINDING THE AVERAGE FOR THE 20 YEAR INTERVAL
      currentAverage = total / data.length;

      // IF A THE AVERAGE IS A NUMBER, THEN PUSH TO GLOBAL LIST
      if (currentAverage !== "NaN"){
        console.log(currentAverage);
      }

      // climateData.push({
      //     "startingYear": startingYear,
      //     "endingYear": endingYear,
      //     "averageClimate": currentAverage
      //   });

      if (climateData.length === 9){
        console.log("match");
        runGraph();
      }
      },
      error:function(){
       console.log("Error, server not responding.");
      }
  });
}

// FOR SCROLLING TO DIFFERENT AREAS OF THE WEBSITE
$(document).on('click', 'a[href^="#"]', function(e){
    // TARGET ELEMENT ID
    var id = $(this).attr('href');

    // TARGETING THE ELEMENT
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // AVOIDING STANDARD RELOAD ON CLICK (IE ESPECIALLY)
    e.preventDefault();

    // TOP POSITION RELATIVE TO THE DOCUMENT
    var pos = $id.offset().top;

    // ANIMATED TOP SCROLLING
    $('body, html').animate({scrollTop: pos});
});

// THIS IS THE D3 GRAPH
function runGraph(){
  console.log(climateData)
  var CurrentColor;

  var margin = {top:30, right:30, bottom:30, left:30}

  var barWidth = 50,
      barOffset = 5,
      width = 1000 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

  var barData = [];
  for (var i = 0; i < climateData.length; i++) {
    barData.push(climateData[i].averageClimate);
  }

  barData.sort(function compareNumbers(a,b){
    return a - b;
  })

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(barData)])
    .range([0, height])
  var xScale = d3.scaleBand()
    .domain(d3.range(0, barData.length))
    .range([0, width])

  var color = d3.scaleLinear()
    .domain([0, barData.length * 0.33, barData.length * 0.66, barData.length])
    .range(["#F22613", "#19B5FE", "#F89406", "#BFBFBF"])

  var tooltip = d3.select("body").append("div")
    .style("position", "absolute")
    .style("padding", "0px 10px")
    .style("background-color", "white")
    .style("opacity", 0)

  // Vertical Bar
  var Graph = d3.select("#chart-container")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("margin-top", "10px")
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
      .attr("id", "BarGraphShapes")
      .selectAll("rect")
        .data(barData)
        .enter().append("rect")
        .style("fill", function(data, i){
          return color(i);
        })
        .attr("width", xScale.bandwidth() + "px")
        .attr("height", 0)
        .attr("x", function(data, i){
          return xScale(i);
        })
        .attr("y", height)
        .on("mouseover", function(data){
          CurrentColor = this.style.fill;
          d3.select(this)
            .style("opacity", 0.5)
        }).on("mouseout", function(data){
          d3.select(this).style("opacity", 1)
          tooltip.style("opacity", 0)
        }).on("click", function(data){
          tooltip.transition()
            .style("opacity", 1)
          tooltip.html(data)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px")
        })

        Graph.transition()
          .duration(1000)
          .attr("height", function(data){
            return yScale(data);
          })
          .attr("y", function(data){
            return height - yScale(data);
          })
          .ease(d3.easeBounce)
          .delay(function(data, i){
            return i * 50;
          })

  for (var i = 0; i < barData.length; i++) {
    console.log(barData[i]);
  }

  // THIS IS THE VERTICAL AXIS FOR THE D3 GRAPH
  var VGuideScale = d3.scaleLinear()
    .domain([0, d3.max(barData)])
    .range([height, 0])

  var vAxis = d3.axisLeft(VGuideScale)
    .ticks(10)

  var vGuide = d3.select("svg").append("g")
    vAxis(vGuide)
    vGuide.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    vGuide.select("path")
      .style("stroke", "red")

  var hAxis = d3.axisBottom(xScale)
    .tickValues(xScale.domain().filter(function(data, i){
      return !(i % (barData.length / 5));
    }))

  var hGuide = d3.select("svg").append("g")
    hAxis(hGuide)
    hGuide.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
    hGuide.select("path")
      .style("stroke", "red")
}

// Kenneth JS
//----------------------------KENNETH--------------------------
console.log("here");


$.ajax({
	url:"http://localhost:3000/tweets.json",
	dataType:"json",
	success: function(data){
		for (var i = 0; i < data.length; i++) {
			var tweet = data[i];
			console.log(data[i]);
			$("#twitter-feed").append("<p class='tweet-font'>"+tweet.text+"</p></br>");
		}
	},
	error: function(){
		console.log("somthing wrong");
	}

});
//----------------------------KENNETH--------------------------


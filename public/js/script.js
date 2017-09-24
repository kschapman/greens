// ------------------- MASSEY STARTING HERE -------------------------

// NAMING AND CALLING VARIABLES
var startingYear = 1920,
    endingYear = 1939,
    finalSet = 9,
    setPresentation = false,
    mouseBar = true;

var climateData = [];

// LOOPING AND CALLING THE SAME FUNCTION, THE YEAR INCREMENTS BY 20 TO CHANGE THE URL
// REQUEST TO THE API.
for (var i = 0; i < finalSet; i++) {
    getInfo(startingYear, endingYear, climateData, i);
    startingYear += 20;
    endingYear += 20;
    console.log(startingYear);
}

// SETTING INNER PADDING FOR CONTAINERS
$(".scrolling-padding").css("padding-top", ($("#nav").height()) + 75);

// ABOUT SECTION HEIGHT TO ACCOMODATE FOR TEXT OVERFLOW-Y
$("#about").css("height", ( ( $("#about").height() + $(".james-text").height() ) - $("#about").height() ) + ($("#nav").height()) + 75 );
console.log($("#about").height() - ( $("#about").height() + $(".james-text").height() ) );

// CREATING THE PRESENTATION MODE
$(".present").click(function(){
  $("#hidden-slider").slideDown(500);

  if (setPresentation){
    $(".fade-this").delay(1000).fadeIn(1000);

    $("#presentation").removeClass("fa-lock");
    $("#presentation").addClass("fa-television");
    $("#action-container").css("top", ($("#graph-values").height() + 5));
    $("#change-heading").text("Rising Temperatures in Aotearoa");

    setPresentation = false;
    mouseBar = true;
  } else {
    var actionHeight = $("#action-container").height(); 
    var actionMarginTop = $("#value-container").height() + 2;
    $(".fade-this").delay(1000).fadeOut(1000);

    $("#presentation").removeClass("fa-television");
    $("#presentation").addClass("fa-lock");
    $("#change-heading").text("Rising Temperatures in Aotearoa");
    $("#value-container").css("height", "auto");

    $("#action-container").css("top", actionMarginTop);

    setPresentation = true;
    mouseBar = false;
  }

  $("#hidden-slider").delay(2000).slideUp(500);
});

// REMOVING PRESENTATION MODE ICONS (LOCK AND UNLOCK)
$("#presentation").hover(function(){
    if (!mouseBar){
      $(this).removeClass("fa-lock");
      $(this).addClass("fa-unlock-alt");
    }
  }, function(){
    if (!mouseBar){
      $(this).removeClass("fa-unlock-alt");
      $(this).addClass("fa-lock");
    }
});

// GETTING THE INFORMATION FROM THE WORLD BANK DATA API FOR DIFFERENT YEARS
// AND THEN PUSHING EVERYTHING TO THE CLIMATEDATA ARRAY.
function getInfo(startingYear, endingYear, climateData, increment){
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
      if (isNaN(currentAverage)){
        return;
      } else {
        climateData.push({
          "startingYear": startingYear,
          "endingYear": endingYear,
          "averageClimate": currentAverage
        });
      }

      if((climateData.length + 1) !== finalSet){
        return;
      } else if ((climateData.length + 1) === finalSet){
        climateData = sortGraphValues(climateData);
        runGraph(climateData);
      }
      },
      error:function(){
       console.log("Error, server not responding.");
      }
  });
}

function sortGraphValues(data){
  data.sort(function compareNumbers(a,b){
    return a["startingYear"] - b["startingYear"];
  })
  return data;
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
  var barColor;

  var margin = {top:30, right:30, bottom:30, left:30}
  var graphHeight = $("#chart-container").height();
  var graphWidth = $("#chart-container").width();
  console.log(graphWidth);

  var barWidth = 50,
      barOffset = 5,
      width = graphWidth - margin.left - margin.right,
      height = graphHeight - margin.top - margin.bottom;

  var averageClimate = [];
  var period = [];

  for (var i = 0; i < climateData.length; i++) {
    averageClimate.push(climateData[i].averageClimate);
    period.push(climateData[i].endingYear);
  }

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(averageClimate)])
    .range([0, height])

  var xScale = d3.scaleBand()
    .domain(d3.range(0, climateData.length))
    .range([0, width])

  var color = d3.scaleLinear()
    .domain([0, averageClimate.length])
    .range(["#0061FF", "#FF4300"])

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
        .data(averageClimate)
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
          if (mouseBar){
            barColor = this.style.fill;
            d3.select(this)
              .style("opacity", 0.5)
          }
        }).on("mouseout", function(data){
          d3.select(this).style("opacity", 1)
        }).on("click", function(data){
          $("#change-heading").text("Rising Temperatures in Aotearoa");
          $("#graph-values").text(data.toFixed(2));
          $("#graph-values").fadeIn(1000);
          $("#deg").fadeIn(1000);
          $(".fa-bar-chart").hide();
        })

  Graph.transition()
    .duration(1000)
    .attr("height", function(data){
      return yScale(data);
    })
    .attr("y", function(data){
      return height - yScale(data);
    })
    .ease(d3.easeElasticOut)
    .delay(function(data, i){
      return i * 300;
    })

  // THIS IS THE VERTICAL AXIS FOR THE D3 GRAPH
  var VGuideScale = d3.scaleLinear()
    .domain([0, d3.max(averageClimate)])
    .range([height, 0])

  var vAxis = d3.axisLeft(VGuideScale)
    .ticks(Math.max.apply(Math, averageClimate))

  var vGuide = d3.select("svg").append("g")
    vAxis(vGuide)
    vGuide.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    vGuide.select("path")
      .style("stroke", "white")

  var hAxis = d3.axisBottom(xScale)
    // .tickValues(xScale.domain(d3.extent(data)));

  // var hAxis = d3.axisBottom(xScale)
  //   .tickValues(
  //     console.log(Number(period[i]))
  //   );

  .tickValues([period][i]);

  var hGuide = d3.select("svg").append("g")
    hAxis(hGuide)
    hGuide.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
    hGuide.select("path")
      .style("stroke", "white")
}

// ------------------- MASSEY ENDING HERE -------------------------

//----------------------------KENNETH--------------------------
$.ajax({
	url:"http://localhost:3000/tweets.json",
	dataType:"json",
	success: function(data){
		for (var i = 0; i < data.length; i++) {
			var tweet = data[i];
			$("#twitter-feed").append("<p class='tweet-font'>"+tweet.text+"</p></br>");
		}
	},
	error: function(){
		console.log("somthing wrong");
	}

});
//----------------------------KENNETH--------------------------
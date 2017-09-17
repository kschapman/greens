var startingYear = 1920,
    endingYear = 1939,
    climateData = [];

for (var i = 0; i < 9; i++) {
  getInfo(startingYear, endingYear);
  startingYear += 20;
  endingYear += 20;
}

// GETTING THE INFORMATION FROM THE WORLD BANK DATA API AND PUSHIN EVERYTHING
// TO THE CLIMATEDATA ARRAY.
function getInfo(startingYear, endingYear){
  $.ajax({
    url: "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/annualavg/tas/" + startingYear + "/" + endingYear + "/NZL",
    dataType: "json",
    success:function(data){
      var currentAverage = 0;
      var total = 0;

      for (var i = 0; i < data.length; i++) {
       total += data[i].annualData[0];
      }

      currentAverage = total / data.length;
      if (currentAverage !== NaN){
        climateData.push({
          "startingYear": startingYear,
          "endingYear": endingYear,
          "averageClimate": currentAverage
        });
      }
      },
      error:function(){
       console.log("Something is not right with me.");
      }
  });
}

// For scrolling to different divisions in the html document
$(document).on('click', 'a[href^="#"]', function(e){
    // target element id
    var id = $(this).attr('href');

    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();

    // top position relative to the document
    var pos = $id.offset().top;

    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
});

$.ajax({
  url: "js/products.json",
  beforeSend: function(xhr){
    if(xhr.overrideMimeType){
      xhr.overrideMimeType("application/json")
    }
  },
  contentType: "application/json",
  dataType: "json",
  success: function(){
    console.log("True");
  }, error: function(){
    console.log("Fail.");
  }
})

// console.log(Products);

// var barData = [45,62,102,62,6,30,45,62,102,62,6,30,200,45,62,102,62,6,30,45,62,102,62,6,30,200];

var CurrentColor;

var margin = {top:30, right:30, bottom:30, left:30}

var barWidth = 50,
  barOffset = 5,
  width = 1000 - margin.left - margin.right,
  height = 1000 - margin.top - margin.bottom;

var barData = [];
for (var i = 0; i < 50; i++) {
  var num = Math.random() * 100
  barData.push(Math.random()*100);
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

// var color = d3.scaleLinear()
//  .domain([0, d3.max(barData)])
//  .range(["#59ABE3", "#CF000F"])

var color = d3.scaleLinear()
  .domain([0, barData.length * 0.33, barData.length * 0.66, barData.length])
  // .domain([0, d3.max(barData) * 0.33, d3.max(barData) * 0.66, d3.max(barData)])
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
    // .style("background-color", "#333")
    .style("margin-top", "10px")
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
    .attr("id", "BarGraphShapes")
    .selectAll("rect")
      .data(barData)
      .enter().append("rect")
      // .style("fill", color)
      .style("fill", function(data, i){
        return color(i);
      })
      .attr("width", xScale.bandwidth() + "px")
      // .attr("height", function(data){
      //  return yScale(data);
      // })
      .attr("height", 0)
      .attr("x", function(data, i){
        return xScale(i);
      })
      // .attr("y", function(data){
      //  return height - yScale(data);
      .attr("y", height)
      // })
      .on("mouseover", function(data){
        CurrentColor = this.style.fill;
        d3.select(this)
          .style("opacity", 0.5)
          // .transition().duration(2000).delay(1000)
          // document.getElementById("value").innerText = data;
      }).on("mouseout", function(data){
        d3.select(this).style("opacity", 1)
        tooltip.style("opacity", 0)
        // .style("fill", CurrentColor)
      }).on("click", function(data){
        // document.getElementById("value").innerText = data;
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

// Vertical Axis
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

// Horizontal Axis
// var HGuideScale = d3.scaleLinear()
//  .domain([barData.length, 0])
//  .range([width, 0])

var hAxis = d3.axisBottom(xScale)
  // .tick(barData.length)
  .tickValues(xScale.domain().filter(function(data, i){
    return !(i % (barData.length / 5));
  }))

var hGuide = d3.select("svg").append("g")
  hAxis(hGuide)
  hGuide.attr("transform", "translate(" + margin.left + ", " + (height + margin.top) + ")")
  hGuide.select("path")
    .style("stroke", "red")



// Horizontal Bar
// d3.select("#container")
//  .append("svg")
//    .attr("width", width)
//    .attr("height", height)
//    .style("background-color", "#AEA8D3")
//    .selectAll("rect")
//      .data(barData)
//      .enter().append("rect")
//      .style("fill", "#913D88")
//      .attr("height", barWidth + "px")
//      .attr("width", function(data){
//        return data;
//      })
//      .attr("y", function(data, i){
//        return i * (barWidth + barOffset);
//      })

// getData();

// var publicKey = "xRvl68WQ8MUMY6plbARg";

// function getData(){
//  $.ajax({
//    // url: "https://data.sparkfun.com/output/" + publicKey + ".json",
//    url: "https://dweet.io/get/latest/dweet/for/oh2xx_temp_2",
//    data: {page: 1},
//    dataType: "jsonp",
//    success: function(DataFromJSON){

//      console.log(DataFromJSON);

//    }, error: function(){
//      console.log("Bad");
//    }
//  });
// }
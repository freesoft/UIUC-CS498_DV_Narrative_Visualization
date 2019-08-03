const yearStart = 2000;
const yearEnd = 2017;
const totalNoOfCountriesToLoad = 400;

const margin = {top: 20, right: 120, bottom: 50, left: 50},
    svgWidth = 900,
    svgHeight = 600,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");
var bisectDate = d3.bisector(function(d) { return d.date; }).left;
var formatValue = d3.format(",");

// WDI call type 
const type = {
    TOTAL: 0,
    MAILE: 1,
    FEMAILE: 2
}

const colors = ["blue","red","yellow","green","black","blue","gray", "lightgray", "orange"];

const chart = d3.select('#chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight)

const innerChart = chart.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// x,y values
var xScale = d3.scaleLinear().range([0,width]);
var yScale = d3.scaleLinear().range([height, 0]);    

// x,y axis
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// line chart related
var valueline = d3.line()
    .x(function(d){ return xScale(d.date);})
    .y(function(d){ return yScale(d.value);})
    .curve(d3.curveLinear);


// Adds the svg canvas
var g = innerChart
    // .call(zoom)
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);    
    
$('.close').click(function() {
    $('.alert').hide();
})

$('.alert').hide();

$("#to_step2").click(function() {
    hide('#step1');
    show('#step2');
    draw("WLD", 1);
})

$("#to_step3").click(function() {
    hide('#step2');
    show('#step3');
    draw("WLD", 2);
})

$("#to_step4").click(function() {
    hide('#step3');
    show('#step4');
    loadCountries(addCountriesList);
})

$("#startover").click(function() {
    hide("#step4");
    hide("#country");
    show("#step1");
})

$("input[name='type']").click(function() {
    draw('WLD', $('input:radio[name=type]:checked').val());
})


function load(){
    d3.json("https://api.worldbank.org/v2/country/all/indicator/SL.EMP.WORK.ZS?format=json&per_page=60&date=" + yearStart + ":" + yearEnd).then(function(d){
        console.log(d);
    });
}

// get all countries ( total 304 countries so far so setting it to 400 items per page to get all the countries information. #TODO fix it so get page meta first to get "total" and send 2nd query to dynamically change the per_pages number to have "total" values)
// provide a callback function to execute with loaded data.
function loadCountries(callback){
    if (typeof callback !== "function") throw new Error("Wrong callback in loadCountries");

    d3.json("https://api.worldbank.org/v2/country?format=json&per_pages=" + totalNoOfCountriesToLoad).then(callback);
}

// get a given country's data
// provide a callback function to execute with loaded data. World total.
function loadTotalEmploymentByCountryCode(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.ZS?format=json&per_page=60&date=" + yearStart + ":" + yearEnd)
        .then(callback);
}
function loadFemaleEmploymentByCountryCode(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.FE.ZS?format=json&per_page=60&date=" + yearStart + ":" + yearEnd)
        .then(callback);
}
function loadMaleEmploymentByCountryCode(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.MA.ZS?format=json&per_page=60&date=" + yearStart + ":" + yearEnd)
        .then(callback);
}

// Only for debugging purpose, provide this function as callback for those API calls to see the loaded data
function debug(d){
    console.log("DEBUG) data loaded:", d);
}

/**
 * callback function
 * @param {*} countryCode 3-digit country code to query, "WLD" is for the world.
 * @param {*} type type constant, 0: total, 1: male, 2: female
 */
function draw(countryCode, type) {
    console.log("country in draw():", countryCode);
    if (type == 0){
        loadTotalEmploymentByCountryCode(countryCode, drawChart);
    }
    else if (type == 1){
        loadMaleEmploymentByCountryCode(countryCode, drawChart);
    }
    else if (type == 2){
        loadFemaleEmploymentByCountryCode(countryCode, drawChart);
    }
    else {
        console.log("error in draw(), type:", type);
    }

}

// callback function for d3.json()
function drawChart(data){

    console.log("data[1] in draw():", data[1]);
    if (data == null || data[1] == null){
        $('.alert').show();
        return;
    }

    //  clean up everything before drawing a new chart
    // d3.select("body").selectAll("svg > *").remove();

    xScale.domain(d3.extent(data[1], function(d) { return d.date; }));
    yScale.domain([0, 100]);

    // Add the X Axis
    console.log("add x axis");
    innerChart
        .append('g')
        .attr('transform', "translate(0," + height + ")")
        .call(xAxis);
    innerChart
        .append("text")             
        .attr("transform",
              "translate(" + (width/2) + " ," + 
                             (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Date");

    console.log("add y axis");
    // Add the Y Axis
    innerChart
        .append('g')
        .call(yAxis)
        .attr("y", 6);

    innerChart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("percentage");


    console.log("draw data");

    var lastXValueForLabel = 0;
    var lastYValueForLabel = 0;
    var lastLineColor = "black";

    innerChart.append("g").append("path").attr("width", width).attr("height",height)
    .datum(data[1].map( (d, i) => {
        console.log("path : date", d.date, "value", d.value);
        lastXValueForLabel = d.date;
        lastYValueForLabel = d.value;
        return {
            date : d.date,
            value : d.value
        };
    }
    ))
    .attr("class", "line")
    .attr("d", valueline)
    .style("stroke", function(d, i) { 
        lastLineColor = colors[Math.floor((Math.random()*6)+1)];
        return lastLineColor;
     });

    //console.log("select value", d3.select("#country option:checked").text());

    if (!d3.select("#country").empty()){
        innerChart.append("g").append("text")
        .attr("transform", "translate(" + width + "," + yScale(lastYValueForLabel) + ")")
        //.attr("transform", "translate(" + xScale(width+3) + "," + yScale(d.value) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", lastLineColor)
        .text(d3.select("#country option:checked").text());
    }


    // test if innerChart exists
    // innerChart.append("rect").attr("width", 100).attr("height", 100).attr("fill", "red");
};

// callback function
function addCountriesList(data, i){

    d3.select("body")
        .append("select")
        .attr("class", "selectpicker")  // Bootstrap thingy
        .attr("id", "country")
        .selectAll("options")
        .data(data[1])
        .enter()
        .append("option")
        .attr("value", function(d){ return d.id; })
        .text(function (d, i){return d.name;});

    d3.select("body").select("select").on("change", function(){
        console.log(d3.select(this).property('value'));
        draw(
            d3.select(this).property('value'), 
            d3.select('input[name=type]:checked').node().value
        );
    });
}

// utility functions
function show(step){
    $(step).show();
}

function hide(step){
    $(step).hide();
}

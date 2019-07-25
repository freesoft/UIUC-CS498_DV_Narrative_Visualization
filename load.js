const yearStart = 2000;
const yearEnd = 2017;
const totalNoOfCountriesToLoad = 400;

const margin = {top: 20, right: 20, bottom: 30, left: 50},
    svgWidth = 800,
    svgHeight = 600,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

// WDI call type 
const type = {
    TOTAL: 0,
    MAILE: 1,
    FEMAILE: 2
}

const chart = d3.select('#chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight)

const innerChart = chart.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// for testing
/* innerChart.append("circle")
.attr("cx", 100)
.attr("cy", 200)
.attr("r", 20)
.attr("fill", "red"); */

var xScale = d3.scaleLinear().range([0,width]);
var yScale = d3.scaleLinear().range([height, 0]);    


var xAxis = d3.axisBottom().scale(xScale);

var yAxis = d3.axisLeft().scale(yScale);

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


/* var lineFunction = d3.select("svg").line()
                         .x(function(d) { return d.year; })
                         .y(function(d) { return d.value; })
                         .interpolate("linear"); */

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
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.MA.ZS?format=json&per_page=60&date=" + yearStart + ":" + yearEnd)
        .then(callback);
}
function loadMaleEmploymentByCountryCode(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.FE.ZS?format=json&per_page=60&date=" + yearStart + ":" + yearEnd)
        .then(callback);
}

// Only for debugging purpose, provide this function as callback for those API calls to see the loaded data
function debug(d){
    console.log("DEBUG) data loaded:", d);
}

/**
 * callback function
 * @param {*} countryCode country code to query, "WLD" is for the world.
 * @param {*} type type constant
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
        console.log("error in draw()");
    }

}

// callback function for d3.json()
function drawChart(data){

    console.log("data[1] in draw():", data[1]);
    if (data == null || data[1] == null){
        alert("no data available");
        return;
    }

    //  clean up everything before drawing a new chart
    // d3.select("body").selectAll("svg > *").remove();

    xScale.domain(d3.extent(data[1], function(d) { return d.date.toString(); }));
    yScale.domain([0, 100]);

    // Add the X Axis
    console.log("add x axis");
    innerChart
        .append('g')
        .attr('transform', "translate(0," + height + ")")
        .call(xAxis);

    console.log("add y axis");
    // Add the Y Axis
    innerChart
        .append('g')
        .call(yAxis)
        .attr("y", 6);


    console.log("draw data");
    g.append("path").attr("width", width).attr("height",height)
    .datum(data[1].map( (d, i) => {
        console.log("path : date", d.date, "value", d.value);
        return {
            date : d.date,
            value : d.value
        };
    }
    ))
    .attr("class", "line")
    .attr("d", valueline);

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
        //var countryCode = d3.select(this).property('value');
        console.log(d3.select(this).property('value'));
        draw(d3.select(this).property('value'), d3.select('input[name=type]:checked').node().value);
    });
}

// utility functions
function show(step){
    $(step).show();
}

function hide(step){
    $(step).hide();
}

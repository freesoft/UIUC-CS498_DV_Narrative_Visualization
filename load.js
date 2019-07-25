const yearStart = 2000;
const yearEnd = 2017;
const totalNoOfCountriesToLoad = 400;

const margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

// WDI call type 
const type = {
    TOTAL: 0,
    MAILE: 1,
    FEMAILE: 2
}

d3.select("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);

x = d3.scaleTime().range([0,width]);
y = d3.scaleLinear().range([height - margin.bottom,0]);

valueline = d3.line()
                .x(function(d){ console.log("x", d.date); return d.date;})
                .y(function(d){ console.log("y", d.value); return d.value;});

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
    d3.selectAll("svg > *").remove();

    x.domain(d3.extent(data[1], function(d) { return parseTime(d.date); }));
    y.domain([0, 100]);


    // Add the X Axis
    console.log("height",height);
    d3.select("svg").append("g")
        .attr("transform", "translate(" + margin.left + "," + (height - margin.bottom) + ")").call(d3.axisBottom(x));

    // Add the Y Axis
    //d3.select("svg").select("g").call(d3.axisLeft(y)).call(g => g.select(".domain").remove());
    d3.select("svg").append("g").attr("transform", "translate(" + margin.left + "," + (margin.top) + ")").call(d3.axisLeft(y));

    d3.select("svg").attr("width", width).attr("height", height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.bottom + margin.bottom) + ")")
        .selectAll()
        .data(data[1], function(d){return d.value}).enter()
        .append("circle").attr("r", function(d){return 2}).attr("cx", function(d){return x(parseTime(d.date))}).attr("cy", function(d){return y(d.value)}).attr("fill", "red");

/*         d3.select("svg").attr("width", width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom)
    .append("g")
    .attr("width", width + margin.left + margin.right).attr("height",height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "line")
    .attr("fill", "black")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 2)
    .datum(data[1], function(d){return d.value;})
    .attr("d", valueline); */

    //.datum(data);
    //.attr("d", data[1]);
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

# UIUC-CS498_DV_Narrative_Visualization

This repository is for CS 498 Data Visualization assignment - Narrative Visualization assignment, required from instructor to publish the result in public accessible place. 

Also, this page will contain a few documentation includiong data source and others.

## Data Source

Used World Bank APIs : 

https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information
https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures

## How to use World Bank APIs

Example code: load "DPANUSSPB" indicator, which means "Exchange rate, new LCU per USD extended backward, period average" for USA, and get the first actual data ( JSON has pagination information at [0], that's why it start with data[0][1] ), and get country id followed by adding the text in DIV html element.  
```javascript
        Promise.all([
            d3.json("http://api.worldbank.org/v2/country/usa/indicator/DPANUSSPB?date=2012M01:2017M12&format=json")
            ]).then(function(data) {
                console.log(data[0][1][0].country) 
                d3.select("body").append("div").html(data[0][1][0].country.id);
        });
```

# UIUC-CS498_DV_Narrative_Visualization

This repository is for CS 498 Data Visualization assignment - Narrative Visualization assignment, required from instructor to publish the result in public accessible place. 

Also, this page will contain a few documentation including data source and others, but the repo is not for sharing entire assignment source code. 

## Data Source

World Bank APIs : 

Developer Information: https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information
API Basic Call Structures: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures
Country API: https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries
Aggregate API query: https://datahelpdesk.worldbank.org/knowledgebase/articles/898614-aggregate-api-queries
Metadata API query: https://datahelpdesk.worldbank.org/knowledgebase/articles/1886695-metadata-api-queries
etc

## How to use World Bank APIs

Example code: load "DPANUSSPB" indicator, which means "Exchange rate, new LCU per USD extended backward, period average" for USA. JSON response will be as follow;

```
[
    {
        "page": 1,
        "pages": 2,
        "per_page": 50,
        "total": 72,
        "sourceid": "1179",
        "lastupdated": "2018-05-07"
    },
    [
        {
            "indicator": {
                "id": "DPANUSSPB",
                "value": "Exchange rate, new LCU per USD extended backward, period average,,"
            },
            "country": {
                "id": "USA",
                "value": "United States"
            },
            "countryiso3code": "",
            "date": "2017M12",
            "value": 1,
            "unit": "",
            "obs_status": "",
            "decimal": 0
        },
     // moar data
```

Following D3 script gets the first actual data ( JSON has pagination information at [0], that's why it start with data[0][1] ), and get country id followed by adding the text in DIV html element.  
```javascript
        Promise.all([
            d3.json("http://api.worldbank.org/v2/country/usa/indicator/DPANUSSPB?date=2012M01:2017M12&format=json")
            ]).then(function(data) {
                console.log(data[0][1][0].country) 
                d3.select("body").append("div").html(data[0][1][0].country.id);
        });
```

# Review Criteria by instructor

An essay will be required and will be submitted along with the URL of the narrative visualization. This essay is an important piece of the assignment as it is used for you to communicate your understanding of the concepts of narrative visualization and how they apply to the one you created.

The essay should contain the following sections.

* <b>Messaging.</b> What is the message you are trying to communicate with the narrative visualization?
* <b>Narrative Structure.</b> Which structure was your narrative visualization designed to follow (martini glass, interactive slide show or drop-down story)? How does your narrative visualization follow that structure? (All of these structures can include the opportunity to "drill-down" and explore. The difference is where that opportunity happens in the structure.)
* <b>Visual Structure.</b> What visual structure is used for each scene? How does it ensure the viewer can understand the data and navigate the scene? How does it highlight to urge the viewer to focus on the important parts of the data in each scene? How does it help the viewer transition to other scenes, to understand how the data connects to the data in other scenes?
* <b>Scenes.</b> What are the scenes of your narrative visualization? How are the scenes ordered, and why
* <b>Annotations.</b> What template was followed for the annotations, and why that template? How are the annotations used to support the messaging? Do the annotations change within a single scene, and if so, how and why
* <b>Parameters.</b> What are the parameters of the narrative visualization? What are the states of the narrative visualization? How are the parameters used to define the state and each scene?
* <b>Triggers.</b> What are the triggers that connect user actions to changes of state in the narrative visualization? What affordances are provided to the user to communicate to them what options are available to them in the narrative visualization?

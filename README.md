# UIUC CS 498 Data Visualization Narrative Visualization

Wonhee Jung (wonheej2@illinois.edu) - University of Illinois at Urbana-Champaign

This repository is for University of Illinois at Urbana-Champaign MCS-DS CS 498 Data Visualization summer 2019 assignment - Narrative Visualization, and published to Github Page per instructor's request.

```
Git Repo : https://github.com/freesoft/UIUC-CS498_DV_Narrative_Visualization/
Github Page : https://freesoft.github.io/UIUC-CS498_DV_Narrative_Visualization/
```

Also, this page will contain a few documentation including data source and others, but the repo is not for sharing entire assignment source code. 

## Data Source

Instead of using static and embeded CSV data source for data visualization, I've decided to use APIs so that data source of this chart doesn't need to be updated later on. In order to do that, I've decided to use World Bank APIs, not downloadable bulk CSVs from World Bank website.

World Bank APIs : 

```
Developer Information: https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information
API Basic Call Structures: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581-api-basic-call-structures
Country API: https://datahelpdesk.worldbank.org/knowledgebase/articles/898590-country-api-queries
Aggregate API query: https://datahelpdesk.worldbank.org/knowledgebase/articles/898614-aggregate-api-queries
Metadata API query: https://datahelpdesk.worldbank.org/knowledgebase/articles/1886695-metadata-api-queries
etc
```

World Bank API provides APIs that users can call with speicifc indicators, and I used `SL.EMP.WORK.ZS` in order to get % of employment for average wage and salary workers. The API also provides the way to obtain eitehr worldwide information(with country code `WLD`) or each individual country's unique three-digit country code. (e.g, USA for United States of America, KOR for South Korea, etc)

## How to use World Bank APIs

Following HTTP Get request for the API is to get average wage and salry worker's % of employment(`SL.EMP.WORK.ZS`), worldwide(`WLD`), and between 2000 and 2017.(`date=2000:2017`).

```
http://api.worldbank.org/v2/country/WLD/indicator/SL.EMP.WORK.ZS?format=json&date=2000:2017
```
And you'll get the response as below;

```
[
    {
        "page": 1,
        "pages": 1,
        "per_page": 50,
        "total": 18,
        "sourceid": "2",
        "lastupdated": "2019-07-10"
    },
    [
        {
            "indicator": {
                "id": "SL.EMP.WORK.ZS",
                "value": "Wage and salaried workers, total (% of total employment) (modeled ILO estimate)"
            },
            "country": {
                "id": "1W",
                "value": "World"
            },
            "countryiso3code": "",
            "date": "2017",
            "value": 51.8887433801719,
            "unit": "",
            "obs_status": "",
            "decimal": 1
        },
     // more data, skipped
```
Which means that wage and salary workers' percentage in 2017 worldwide was 51.88%.


# Review Criteria

An essay will be required and will be submitted along with the URL of the narrative visualization. This essay is an important piece of the assignment as it is used for you to communicate your understanding of the concepts of narrative visualization and how they apply to the one you created.

The essay should contain the following sections.

* <b>Messaging.</b> What is the message you are trying to communicate with the narrative visualization?

```
labor force -> didn't change much 39.46 -> 39.037 %
wage and salary worker % -> increased 44.8% -> 52.4%
population -> increased 3.0 billion -> 3.72 billion

```

* <b>Narrative Structure.</b> Which structure was your narrative visualization designed to follow (martini glass, interactive slide show or drop-down story)? How does your narrative visualization follow that structure? (All of these structures can include the opportunity to "drill-down" and explore. The difference is where that opportunity happens in the structure.)

```
I've used Martini Glass structure. Added first a few slides to show the line chart that I wanted to tell, and then added the last chart in the slide with a few controllable options that viewer can use in order to get a different perspective e.g, be able to get country specific, or male/female, etc.
```

* <b>Visual Structure.</b> What visual structure is used for each scene? How does it ensure the viewer can understand the data and navigate the scene? How does it highlight to urge the viewer to focus on the important parts of the data in each scene? How does it help the viewer transition to other scenes, to understand how the data connects to the data in other scenes?

```
The top of each scene has HTML DIV layer that includes the message that each scene want to tell. 
Also this text section includes link to the next scene for navigation. 
At the very last scene, I've added the link to the first page so that viewer can star over entire view process. 
```

* <b>Scenes.</b> What are the scenes of your narrative visualization? How are the scenes ordered, and why

```

```

* <b>Annotations.</b> What template was followed for the annotations, and why that template? How are the annotations used to support the messaging? Do the annotations change within a single scene, and if so, how and why

```

```

* <b>Parameters.</b> What are the parameters of the narrative visualization? What are the states of the narrative visualization? How are the parameters used to define the state and each scene?

```

```

* <b>Triggers.</b> What are the triggers that connect user actions to changes of state in the narrative visualization? What affordances are provided to the user to communicate to them what options are available to them in the narrative visualization?

```
I've added a tooltip on top of the line chart.
```

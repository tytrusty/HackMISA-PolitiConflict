"use strict";

const Sunlight = require("./index.js");
let sunlight  = new Sunlight();



/* ------------------------------------- Get Reps by Zipcode ------------------------------- */

console.log("Yay file called! Something is messed up though");
console.log(sunlight);

let repsByZip = sunlight.getRepsByZipcode(75074); //method falls return promises

repsByZip.then(function onFulfill(data) { //expect data to be a JS object
    let prettyData = sunlight.cleanRepsByZipcodeData(data);
    console.log(prettyData);
}).catch(function onError(error) {
    console.log(error);
});



/* ------------- repVote calls ----------------------------------*/

/*
let repsVotes = sunlight.getMostRecentVotes("J000174");

repsVotes.then(function onFulfill(data) {
    console.log(sunlight.cleanVoteData(data));

}).catch(function onError(error) {
    console.log(error);
});
*/
/*  -------------------------repInfo calls ------------------------*/
/*
let repInfo = sunlight.getRepContactInfo("J000174");

repInfo.then(function onFulfill(data) {
    console.log(sunlight.cleanRepContactInfo(data));
}).catch(function onError(error) {
    console.log(error);
});
*/

/* ----------------------- DATA INFO ------------------------------ */


/*Pretty data for reps by zipcode should follow the schema of:
{
    "house" : [
        {
            "fullName" : [string],
            "party" : [string],
            "bioguideId : [string],
            "district" : [number]
        },...
    ],
    "senate" : [
        {
            "fullName" : [string],
            "party" : [string],
            "bioguideId : [string],
        }
    
    
    
    ]
}
*/

/*---------------------------------Voting Records ------------------------------*/

/* -------------------------------Raw Data -----------------------------*/
/*
{
    "results" : [
        {
            "bill": {
                "bill_id" : [string],
                "official_title" : [string]
            },
            "voted_at" : [string],
            "voter_ids" : {
                "[bioguide_id]" : [string]
            }
        },...
        
    
    
    
    ],
    "count" : [number],
    "page" : [Object]
}


*/






/*
Pretty data for voting records

[
    {
        "bill_id" : [string],
        "bill_title" : [string],
        "recorded-vote": [string]
    },...



]


*/
function cleanVoteData(data) {
    let cleanedData = [];
    data.results.forEach(function (element, index, arr) {
        let holderObj = {};
        holderObj["bill_id"] = element.bill.bill_id;//billid from element
        holderObj["bill_title"] = element.bill.official_title;
        holderObj["recorded-vote"] = element.voter_ids[Object.getOwnPropertyNames(element.voter_ids)[0]];
        cleanedData.push(holderObj);
    });
    return cleanedData;
}




/*--------------------------Clean Rep Data----------------------------*/
/* Clean form should follow this schema

{
    "fullName" : [string],
    "phoneNumber" : [string],
    "email" : [string],
    "seat" : [string],
    "party" : [string],
    "contactForm" : [string]
}


Form expected from API call

{
    "results" : [ {
            "aliases" : [Array],
            "contact_form" : [string] or null,
            "party" : [string],
            "phone" : [string],
            "title" : [string],
            "website" : [string]
        },
    
    ],
    "count": [number],
    "page": [Object]
}


*/

function cleanRepContactInfo(data) {
    let cleanedData = {};
    cleanedData["fullName"] = data.results[0].aliases[0];
    cleanedData["contactForm"] = data.results[0].contact_form;
    cleanedData["party"] = data.results[0].party;
    cleanedData["title"] = data.results[0].title;
    cleanedData["website"] = data.results[0].website;
    return cleanedData;
    
}



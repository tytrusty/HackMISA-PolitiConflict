/* Sunlight API Wrapper */
"use strict";

const request = require("request");

let customRequest = wrapRequestWithPromise(request.get);

class SunlightAPIWrapper {
    constructor() {
        this.baseUrl = "https://congress.api.sunlightfoundation.com/";

    }
    
    getRepsByZipcode(zipcode) { //This returns a promise
        let options = {};
        options.qs = {};
        options.qs["zip"] = zipcode;
        options["uri"] = `${this.baseUrl}legislators/locate/`;
        options.qs["fields"] = "chamber,aliases,party,bioguide_id,district";
        return customRequest(options);
            
    }
    
    getMostRecentVotes(bioguide_id) {
        let options = {};
        options.qs = {};
        options["uri"] = `${this.baseUrl}votes/`;
        options.qs["fields"] = `voter_ids.${bioguide_id},voted_at,bill.bill_id,bill.official_title,bill.urls.congress`; //returns, bioguide_ids vote, vote time, bill id, and bill official title
        options.qs[`voter_ids.${bioguide_id}__exists`] = "true"; //check that this rep voted
        options.qs["order"] = "voted_at__desc"; //order votes chronologically
        options.qs["bill.bill_id__exists"] = "true"; //check that this vote is regarding a bill
        return customRequest(options);
        
    }
    getRepContactInfo(bioguide_id) {
        let options = {};
        options.qs = {};
        options["uri"] = `${this.baseUrl}legislators/`;
        options.qs["bioguide_id"] = `${bioguide_id}`;
        options.qs["fields"] = `party,title,aliases,phone,website,contact_form`; //returns, bioguide_ids vote, vote time, bill id, and bill official title
        return customRequest(options);
        
    }
    
    getBillKeywords(bill_id) {
        let options = {};
        options.qs = {};
        options["uri"] = `${this.baseUrl}bills/search/`;
        options.qs["bill_id"] = `${bill_id}`;
        options.qs["fields"] = 'keywords'; //returns, bioguide_ids vote, vote time, bill id, and bill official title
        return customRequest(options);
        
    }
    
    cleanRepContactInfo(data) {
        let cleanedData = {};
        let rep = data.results[0];
        cleanedData["fullName"] = rep.aliases[0];
        cleanedData["contactForm"] = rep.contact_form;
        if (rep.party == "R") {
            cleanedData.party = "Republican";
        } else if (rep.party == "D") {
            cleanedData.party = "Democrat";
        } else {
            cleanedData.party = rep.party;
        }
        if (rep.title == "Rep") {
            cleanedData.title = "Representative";
        } else if (rep.title == "Sen") {
            cleanedData.title = "Senator";
        } else {
            cleanedData.title = rep.title;
        }
        cleanedData["website"] = rep.website;
        cleanedData["phone"] = rep.phone;
        return cleanedData;
    
    }
    cleanRepsByZipcodeData(data) {
        let cleanedData = {
            "senate" : [],
            "house" : []
        };
        data.results.forEach(function (element, index, arr) { //for each representative object returned
            let next = {};
            next.fullName = element.aliases[0];
            if (element.party == "R") {
                next.party = "Republican";
            } else if (element.party == "D") {
                next.party = "Democrat";
            } else {
                next.party = element.party;
            }
            next.bioguideId = element.bioguide_id;
            if (element.chamber == "house") {
                next.district = element.district;
                cleanedData.house.push(next);
            } else {
                cleanedData.senate.push(next);
            }
        });
    
        return cleanedData;
    }
    cleanVoteData(data) {
        let cleanedData = [];
        data.results.forEach(function (element, index, arr) {
            let holderObj = {};
            holderObj["bill_id"] = element.bill.bill_id;//billid from element
            holderObj["bill_title"] = element.bill.official_title;
            holderObj["recorded_vote"] = element.voter_ids[Object.getOwnPropertyNames(element.voter_ids)[0]];
            holderObj["bill_website"] = element.bill.urls.congress;
            cleanedData.push(holderObj);
        });
        return cleanedData;
    }
    
}

/*This uses the special callback for request module http calls*/

function wrapRequestWithPromise(fn) {
    return function() {
        let args = [].slice.call(arguments);
        
        return new Promise(function(resolve, reject) {
            fn.apply(
                null,
                args.concat(function (error, response, body){
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode == 200) {
                        resolve(JSON.parse(body));
                    }
                    else {
                        reject(`Status code is ${response.statusCode}`);
                    }
                })
            );
        });
    };
}

module.exports = SunlightAPIWrapper;



/* ----------------------- DATA INFO ------------------------------ */
/*FOR FUNCTION cleanRepsByZipcodeData*/


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
/* FOR function cleanVoteData*/

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


/*--------------------------Clean Rep Data----------------------------*/
/* FOR FUNCTION cleanRepContactInfo */
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




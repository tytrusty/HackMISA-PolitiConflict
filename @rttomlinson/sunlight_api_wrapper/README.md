Wrapper functions for the Sunlight API

available functions

getRepsByZipcode(zipcode)
Calling this function will return an object with the following schema:
{
    "location" : {
        "zipcode" : [number],
        "city-state" : [string]
    },
    "house" : [
        {
            "name": [string],
            "contact-info": {},
            "party-affiliation" : [string]
        },...
    ],
    "senate" : [
        {
            "name": {},
            "contact-info": {},
            "party-affiliation" : [string]
        },...
    ]
}

getContactAndVote(id)
{
    "location" : {
        "zipcode" : [number],
        "city-state" : [string]
    },
    "rep-info" : {
        "name": [string],
        "contact-info": {},
        "party-affiliation" : [string]
    },
    "vote-record" : [ {
        "bill-name" : [string],
        "bill-id" : [string],
        "bill-summary" : [string],
        "vote" : [boolean]
        },...
    ]
}



Author: Renzo Tomlinson
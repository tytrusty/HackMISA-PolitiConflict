"use strict";

var express = require('express');
var router = express.Router();


const Sunlight = require("@rttomlinson/sunlight_api_wrapper");
let sunlight  = new Sunlight();

/* GET home page. */
router.get('/', function(req, res, next) {
    let zipcode = req.query.zipcode;
    let landingPageUrl = req.protocol + "://" + req.hostname;
    let repsByZip = sunlight.getRepsByZipcode(zipcode); //method falls return promises
    
    repsByZip.then(function onFulfill(data) { //expect data to be a JS object
        let cleanedData = sunlight.cleanRepsByZipcodeData(data); //data is returned to us in the form as stated below
        res.render('repsByZip', { "house": cleanedData.house, "senate": cleanedData.senate, "zipcode" : zipcode, "landingPageUrl" : landingPageUrl });
    }).catch(function onError(error) {
        res.render('error.hbs');
    });

});


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
function cleanRepData(rep) {
    let cleanData = {};
    cleanData.fullName = rep.aliases[0];
    cleanData.party = rep.party;
    cleanData.bioguideId = rep.bioguide_id;
    if (rep.chamber == "house") {
        cleanData.district = rep.district;
    }
    return cleanData;
}



module.exports = router;


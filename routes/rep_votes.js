"use strict";

var express = require('express');
var govTrack = require('govtrack-node');
var router = express.Router();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


const Sunlight = require("@rttomlinson/sunlight_api_wrapper");
let sunlight  = new Sunlight();


/* GET home page. */
router.get('/', function(req, res, next) {
    let bioguideId = req.query.bioguide_id;
    let landingPageUrl = req.protocol + "://" + req.hostname;    
    let repVotes = sunlight.getMostRecentVotes(bioguideId); //method falls return promises
    let repInfo = sunlight.getRepContactInfo(bioguideId);
    console.log("test");

    Promise.all([repVotes, repInfo]).then(function onFulfill(data) {
        let bills = sunlight.cleanVoteData(data[0]);
        let info = sunlight.cleanRepContactInfo(data[1]);
    	
        res.render('repVotes', { "bills" : bills, "bioguideId" : bioguideId, "repInfo" : info, "layout" : "rep_votes_layout.hbs", "landingPageUrl" : landingPageUrl });
        //console.log(JSON.stringify(data[0]));
        //listCongress(bioguideId);
        for(var key in bills) {
        	var keywords = sunlight.getBillKeywords(bills[key].bill_id);
        	console.log("BILL: " + bills[key].bill_id);
       		Promise.all([keywords]).then(function onFulfill(data) {
       			console.log(data[0].results[0].keywords);
       			
       			//console.log(JSON.stringify(bills[keywords]));
        	    //console.log(JSON.stringify(keywords));
       		});
        }
        //}
        //sunlight.getBillKeywords(bill_id) 

    }).catch(function onError(error) {
        console.log(error);
    });

});


function listCongress(bioguideID) {
  //  ihttps://www.govtrack.us/api/v2/vote_voter/?person=412573&limit=6000&order_by=created&format=json&fields=vote__id,created,option__value,vote__category,vote__chamber,vote__question,vote__number

  govTrack.findRole({current : true}, function(err, res) {
    if (!err) {
    	console.log("desired id " + bioguideID);
      for (var key in res.objects) {
        if (res.objects[key].person.bioguideid == bioguideID) {
        	var url = "https://www.opensecrets.org/db2dl/?q=MemContrib&cid=" + res.objects[key].person.osid + "&cycle=2016&output=JSON&type=I";
          getJSON({
    		url: url,
   			success: function(json){
      		console.log('getJSON success');
      		console.log(json);
    	 },
    		error: function(error){
      		console.error('An error occured');
      		console.error(error);
    	 },
    		complete: function(){
      		console.log('I\'m invoked in any case after success/error');
    }
});
          // for(var val in res.objects[key].person) {
          //  console.log(val + " value: " + res.objects[key].person[val]);
          //}

          /*govTrack.findVoteVoter({person:400222, limit:2000, fields:vote__id}, function(err, res_json) {
            if (!err) {
              console.log(JSON.stringify(res_json, null, 4));
            } else {
              console.log("error finding voting record");
            }

          });*/
        }
      }
    }
  });
}



/**
 * Send Ajax
 * @param {{
*  type: {String},
*  url: {String},
*  [success]: {Function},
*  [error]: {Function},
*  [beforeSend]: {Function},
*  [cache]: {Boolean}
* }} params
 */
var MAX_XHR_WAITING_TIME = 5000;// in ms

var sendAjax = function (params) {
    var xhr = new XMLHttpRequest(),
            url = params.cache ? params.url + '?' + new Date().getTime() : params.url,
            timer = setTimeout(function () {// if xhr won't finish after timeout-> trigger fail
                xhr.abort();
                params.error && params.error();
                params.complete && params.complete();
            }, MAX_XHR_WAITING_TIME);
    xhr.open(params.type, url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            clearTimeout(timer);
            if (xhr.status === 200 || xhr.status === 0) {// 0 when files are loaded locally (e.g., cordova/phonegap app.)
                params.success && params.success(xhr.responseText);
                params.complete && params.complete();
            } else {
                params.error && params.error(xhr.responseText);
                params.complete && params.complete();
            }
        }
    };
    params.beforeSend && params.beforeSend(xhr);
    xhr.send();
};

/**
 * Get JSON by url
 @param {{
*  url: {String},
*  [success]: {Function},
*  [error]: {Function},
*  [complete]: {Function}
* }} params
 */
var getJSON = function (params) {
    sendAjax({
        type: 'get',
        url: params.url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json, text/javascript');
        },
        success: function (res) {
            params.success && params.success(JSON.parse(res));
        },
        error: params.error,
        complete: params.complete,
        cache: true
    });
};

// INVOKE


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
        "recorded_vote": [string]
    },...



]


*/

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


module.exports = router;

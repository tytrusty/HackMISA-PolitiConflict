// include the module
var govTrack = require('govtrack-node');

listCongress();

function listCongress() {
  //  ihttps://www.govtrack.us/api/v2/vote_voter/?person=412573&limit=6000&order_by=created&format=json&fields=vote__id,created,option__value,vote__category,vote__chamber,vote__question,vote__number

  govTrack.findRole({current : true}, function(err, res) {
    if (!err) {
      for (var key in res.objects) {
        if (res.objects[key].person.lastname == "Cruz") {
          console.log("id: " + res.objects[key].person.id);
          // for(var val in res.objects[key].person) {
          //  console.log(val + " value: " + res.objects[key].person[val]);
          //}

          govTrack.findVoteVoter({person:400222, limit:2000, fields:vote__id}, function(err, res_json) {
            if (!err) {
              console.log(JSON.stringify(res_json, null, 4));
            } else {
              console.log("error finding voting record");
            }

          });
        }
      }
    }
  });
}

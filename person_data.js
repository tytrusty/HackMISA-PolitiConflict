//include the module
var govTrack = require('govtrack-node');

listCongress();


function listCongress() {
  govTrack.findRole({current:true}, function(err, res) {
    if(!err) {
      for (var key in res.objects) {
        if(res.objects[key].person.lastname == "Cruz") {
          console.log("id: " + res.objects[key].person.id); 
          //for(var val in res.objects[key].person) {
          //  console.log(val + " value: " + res.objects[key].person[val]);
          //}
        }
      }
    }
  });
}

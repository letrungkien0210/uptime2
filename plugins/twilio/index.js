/**
 * Created by deathowl on 1/4/16.
 */
var https      = require('https');
var url        = require('url');
var util       = require('util');
var config     = require('config');
var CheckEvent = require('../../models/checkEvent');
var twilio_config = config.twilio;
var client = require('twilio')(twilio_config.accountSid, twilio_config.authToken);


exports.initWebApp = function() {
  CheckEvent.on('afterInsert', function(checkEvent) {
    people = twilio_config.people;
    checkEvent.findCheck(function(err, check) {
        if (checkEvent.message ==="down") {
            people.forEach(function (phonenumber) {
                client.makeCall({
                    to: phonenumber,
                    from: twilio_config.accountNumber,
                    url: twilio_config.voiceXml
                }, function (err, call) {
                    console.log('This call\'s unique ID is: ' + call.sid);
                    console.log('This call was created at: ' + call.dateCreated);
                });
            });
        }
    });

    });
  console.log('Enabled Twilio plugin');
};
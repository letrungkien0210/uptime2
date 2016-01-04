/**
 * Created by deathowl on 1/4/16.
 */
/**
 * Webhooks plugin
 *
 * Notifies all events (up, down, paused, restarted) by sending a
 * HTTPS POST request to a slack.com URL. The request will have a
 * JSON payload of data from the event
 *
 *
 * Example configuration
 *   webhooks:
 *     event:
 *       up:
 *         - 'https://xxxx.slack.com/services/hooks/incoming-webhook?token=xxxxxx'
 *       down:
 *         - 'https://xxxx.slack.com/services/hooks/incoming-webhook?token=xxxxxx'
 *       paused:
 *         - 'https://xxxx.slack.com/services/hooks/incoming-webhook?token=xxxxxx'
 *       restarted:
 *         - 'https://xxxx.slack.com/services/hooks/incoming-webhook?token=xxxxxx'
 *     dashboardUrl: 'http://uptime.example.com'
 *     channel:      '#slack-channel'
 *     username:     'uptime'
 *     icon_emoji:   ':fire:'
 */

var https      = require('https');
var url        = require('url');
var util       = require('util');
var config     = require('config');
var CheckEvent = require('../../models/checkEvent');
var Slack      = require('slack-node');


exports.initWebApp = function() {
  CheckEvent.on('afterInsert', function(checkEvent) {
    var slack_config = config.slack;
    slack = new Slack();
    slack.setWebhook(slack_config.webhookUri);

    checkEvent.findCheck(function(err, check) {
        var payload = {};
        if (err) return console.error(err);
        text        = '<' + slack_config.dashboardUrl + '/dashboard/checks/' + check._id + '?type=hour&date=' + checkEvent.timestamp.valueOf() + '|' + check.name +'>' + ' ' + checkEvent.message;

        slack.webhook({
          channel: slack_config.channel,
          username: slack_config.username,
          icon_emoji: slack_config.emoji,
          text: text
        }, function(err, response) {
          console.log(response);
        });

    });
  });
  console.log('Enabled slack.com webhook plugin');
};
"""Sends notifications to a Slack webhook."""

import json
import requests

import event


class ConfigError(Exception):
    """Raised when the JSON config file can't be read."""


class Notifier(object):

    def __init__(self, webhook_url, channel):
        self.url = webhook_url
        self.channel = channel

    def notify(self, event_type, player_name, team, description):
        """Sends a message to Slack.

        Args:
            event_type: An event.Type.
            player_name: The QB's name.
            team: The QB's team abbreviation.
            description: Description of the play.
        """
        if event_type == event.Type.INT:
            what = 'threw an interception'
        elif event_type == event.Type.INT_TD:
            what = 'threw a pick-6'
        elif event_type == event.Type.FUM:
            what = 'lost a fumble'
        elif event_type == event.Type.FUM_TD:
            what = 'lost a fumble for a TD'
        elif event_type == event.Type.SAFETY:
            what = 'gave up a safety'
        else:
            return

        icon_url = ('https://nflcdns.nfl.com/static/site/img/logos/png-500x500/'
                    'teams/{0}.png'
                    .format(team))

        payload = {
            'text' : ('*{qb} ({team})* {what}\n'
                      '>{desc}'
                      .format(qb=player_name, team=team, what=what,
                              desc=description)),
            'channel': self.channel,
            'icon_url': icon_url,
        }
        requests.post(self.url, json=payload)
        # TODO(aerion): Check for errors and maybe do something about them.

    @staticmethod
    def from_json_file(config_path):
        try:
            with open(config_path) as f:
                slack_config = json.loads(f.read())
        except (OSError, json.decoder.JSONDecodeError) as e:
            raise ConfigError(e)
        for key in ('webhookUrl', 'channel'):
            if key not in slack_config:
                raise ConfigError('Missing required key "webhookUrl"')
        return Notifier(slack_config['webhookUrl'], slack_config['channel'])


class NoOpNotifier(object):
    """Accepts the same API as Notifier, but does nothing."""

    def __init__(self):
        pass

    def notify(self, *args, **kwargs):
        pass

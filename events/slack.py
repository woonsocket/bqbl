"""Sends notifications to a Slack webhook."""

import enum
import json
import requests


class ConfigError(Exception):
    """Raised when the JSON config file can't be read."""


# TODO(aerion): This could probably be defined somewhere better.
class EventType(enum.Enum):
    # Don't assign any meaning to these numbers. We should use enum.auto()
    # whenever we're on Python 3.6.
    INT = 1
    INT_TD = 2
    FUM = 3
    FUM_TD = 4
    SAFETY = 3


class Notifier(object):

    def __init__(self, webhook_url, channel):
        self.url = webhook_url
        self.channel = channel

    def notify(self, event_type, player_name, team, description):
        """Sends a message to Slack.

        Args:
            event_type: A slack.EventType.
            player_name: The QB's name.
            team: The QB's team abbreviation.
            description: Description of the play.
        """
        if event_type == EventType.INT:
            what = 'threw an interception'
        elif event_type == EventType.INT_TD:
            what = 'threw a pick-6'
        elif event_type == EventType.FUM:
            what = 'lost a fumble'
        elif event_type == EventType.FUM_TD:
            what = 'lost a fumble for a TD'
        elif event_type == EventType.SAFETY:
            what = 'gave up a safety'
        else:
            return

        payload = {
            'text' : ('{qb} ({team}) {what}\n'
                      '{desc}'
                      .format(qb=player_name, team=team, what=what,
                              desc=description)),
            'channel': self.channel,
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

"""Sends notifications to a Slack webhook."""

import enum
import requests


# TODO(aerion): This could probably be defined somewhere better.
class EventType(enum.Enum):
    # Don't assign any meaning to these numbers. We should use enum.auto()
    # whenever we're on Python 3.6.
    INT_TD = 1
    FUM_TD = 2
    SAFETY = 3


class Notifier(object):

    def __init__(self, webhook_url):
        self.url = webhook_url

    def notify(self, event_type, player_name, team):
        """Sends a message to Slack.

        Args:
            event_type: A slack.EventType.
            player_name: The QB's name.
            team: The QB's team abbreviation.
        """
        if event_type == EventType.INT_TD:
            desc = 'threw a pick-6'
        elif event_type == EventType.FUM_TD:
            desc = 'lost a fumble for a TD'
        elif event_type == EventType.SAFETY:
            desc = 'gave up a safety'
        else:
            return

        payload = {
            'text' : ('{qb} ({team}) {desc}'
                      .format(qb=player_name, team=team, desc=desc)),
        }
        requests.post(self.url, json=payload)
        # TODO(aerion): Check for errors and maybe do something about them.


class NoOpNotifier(object):
    """Accepts the same API as Notifier, but does nothing."""

    def __init__(self):
        pass

    def notify(self, *args, **kwargs):
        pass

"""Events in a football game.

We're mostly interested in turnovers, which are BQBL scoring events.
"""

import enum


class Type(enum.Enum):
    # Don't assign any meaning to these numbers. We should use enum.auto()
    # whenever we're on Python 3.6.
    INT = 1
    INT_TD = 2
    FUM = 3
    FUM_TD = 4
    SAFETY = 5


class Events(object):
    """Data object for holding "interesting" events."""

    def __init__(self):
        self.fumbles = {}
        self.safeties = {}
        self.interceptions = {}
        self.passers = {}

    @staticmethod
    def _id(game_id, play_id):
        return '{g}-{p}'.format(g=game_id, p=play_id)

    @staticmethod
    def _summary(player_name, play):
        return {
            'name': player_name,
            'desc': play['playDescription'],
            'team': play['possessionTeam']['abbreviation'],
            'quarter': play['quarter'],
            'time': play['clockTime'],
        }

    def add_fumble(self, game_id, play_id, player_name, play, is_opponent_td):
        """Add a fumble event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            player_name: A human-readable name of the QB.
            play: A play dict, decoded from JSON.
            is_opponent_td: Whether the fumble was returned for a touchdown.
        """
        summary = Events._summary(player_name, play)
        summary['td'] = is_opponent_td
        self.fumbles[Events._id(game_id, play_id)] = summary

    def add_interception(self, game_id, play_id, player_name, play,
                         is_opponent_td):
        """Adds an interception event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            player_name: A human-readable name of the QB.
            play: A play dict, decoded from JSON.
            is_opponent_td: Whether the fumble was returned for a touchdown.
        """
        summary = Events._summary(player_name, play)
        summary['td'] = is_opponent_td
        self.interceptions[Events._id(game_id, play_id)] = summary

    def add_safety(self, game_id, play_id, player_name, play, is_qb_fault):
        """Adds a safety event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            player_name: A human-readable name of the QB.
            play: A play dict, decoded from JSON.
            is_qb_fault: Whether the QB is clearly at fault. We may have some
                false negatives here; the frontend provides a way to override
                this so you can blame a QB in non-obvious cases.
        """
        summary = Events._summary(player_name, play)
        summary['qbFault'] = is_qb_fault
        self.safeties[Events._id(game_id, play_id)] = summary

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
    SAFETY = 3


class Events(object):
    """Data object for holding "interesting" events."""

    def __init__(self, fumbles, safeties, interceptions, passers):
        self.fumbles = fumbles
        self.safeties = safeties
        self.interceptions = interceptions
        self.passers = passers

    @staticmethod
    def _id(game_id, play_id):
        return '{g}-{p}'.format(g=game_id, p=play_id)

    @staticmethod
    def _summary(play):
        return {
            'desc': play['desc'],
            'team': play['posteam'],
            'quarter': play['qtr'],
            'time': play['time'],
        }

    def add_fumble(self, game_id, play_id, play, is_opponent_td):
        """Add a fumble event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            play: A play dict, decoded from JSON.
            is_opponent_td: Whether the fumble was returned for a touchdown.
        Returns:
            Whether this event is new (i.e., the play ID was not previously
            known to this Events object).
        """
        summary = Events._summary(play)
        summary['td'] = is_opponent_td
        id = Events._id(game_id, play_id)
        is_new = id not in self.fumbles
        self.fumbles[id] = summary
        return is_new

    def add_interception(self, game_id, play_id, play, is_opponent_td):
        """Adds an interception event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            play: A play dict, decoded from JSON.
            is_opponent_td: Whether the fumble was returned for a touchdown.
        Returns:
            Whether this event is new (i.e., the play ID was not previously
            known to this Events object).
        """
        summary = Events._summary(play)
        summary['td'] = is_opponent_td
        id = Events._id(game_id, play_id)
        is_new = id not in self.interceptions
        self.interceptions[id] = summary
        return is_new

    def add_safety(self, game_id, play_id, play):
        """Adds a safety event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            play: A play dict, decoded from JSON.
        Returns:
            Whether this event is new (i.e., the play ID was not previously
            known to this Events object).
        """
        summary = Events._summary(play)
        id = Events._id(game_id, play_id)
        is_new = id not in self.safeties
        self.safeties[Events._id(game_id, play_id)] = summary
        return is_new

    def add_passer(self, team, player_id, name):
        """Adds a passer.

        This means that the player threw a pass for the given team. The frontend
        provides a way for admins to mark a passer as having been benched, which
        is worth points for the team.

        Args:
            team: The team abbreviation.
            player_id: The ID of the player.
            name: The human-readable name of the player, e.g., "J. Edelman".
        Returns:
            Whether this passer is new (i.e., the player ID was not previously
            known to this Events object).
        """
        is_new = player_id not in self.passers
        self.passers[player_id] = {'team': team, 'name': name}
        return is_new

    @staticmethod
    def create_from_dict(d):
        """Initializes an Events from a dict.

        Each value in the dict is a dict mapping an event ID (see _id) to an
        event (see _summary).
        """
        return Events(
            fumbles=d.get('fumbles', {}),
            safeties=d.get('safeties', {}),
            interceptions=d.get('interceptions', {}),
            passers=d.get('passers', {}))


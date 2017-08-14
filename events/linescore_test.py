import linescore
import unittest


class TestParseGameClock(unittest.TestCase):

    def test_specific_phases_ignore_clock(self):
        self.assertEquals(4501, linescore.parse_game_clock('FINAL', '00:00'))
        self.assertEquals(4501, linescore.parse_game_clock('FINAL', '00:28'))
        self.assertEquals(4501, linescore.parse_game_clock('FINAL', '00:01'))
        self.assertEquals(4501, linescore.parse_game_clock('FINAL', 'wx:yz'))
        self.assertEquals(1800, linescore.parse_game_clock('HALFTIME', '00:00'))
        self.assertEquals(1800, linescore.parse_game_clock('HALFTIME', '00:12'))

    def test_unknown_phase(self):
        self.assertEquals(0, linescore.parse_game_clock('PREGAME', '08:00'))
        self.assertEquals(0, linescore.parse_game_clock('Q5', '08:00'))
        self.assertEquals(0, linescore.parse_game_clock('QX', '08:00'))
        self.assertEquals(0, linescore.parse_game_clock('FULLMOON', '08:00'))

    def test_bogus_clock(self):
        self.assertEquals(0, linescore.parse_game_clock('Q2', '1500'))
        self.assertEquals(0, linescore.parse_game_clock('Q2', 'MM:SS'))

    def test_clock_math(self):
        self.assertEquals(0, linescore.parse_game_clock('Q1', '15:00'))
        self.assertEquals(420, linescore.parse_game_clock('Q1', '08:00'))
        self.assertEquals(900, linescore.parse_game_clock('Q1', '00:00'))
        self.assertEquals(900, linescore.parse_game_clock('Q2', '15:00'))
        self.assertEquals(901, linescore.parse_game_clock('Q2', '14:59'))
        self.assertEquals(2112, linescore.parse_game_clock('Q3', '09:48'))
        self.assertEquals(3600, linescore.parse_game_clock('OT', '15:00'))
        self.assertEquals(3660, linescore.parse_game_clock('OT', '14:00'))
        self.assertEquals(4500, linescore.parse_game_clock('OT', '00:00'))


if __name__ == '__main__':
    unittest.main()

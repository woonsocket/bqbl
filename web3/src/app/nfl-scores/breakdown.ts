export declare interface ScoreBreakdown {
  /** QB benched. */
  bench: BasicEntry;
  /** Completion rate. */
  completion: CompletionEntry;
  /** Street free agent started the game. */
  freeAgent: BasicEntry;
  /** Fumbles retained by the QB's team. */
  fumbleKept: BasicEntry;
  /** Longest pass. */
  longPass: YardageEntry;
  /** Stats and rating for individual passers. */
  passerRating: PasserRatingEntry;
  /** Total passing yards. */
  passingYardage: YardageEntry;
  /** Total rushing yards. */
  rushingYardage: YardageEntry;
  /** Sacks. */
  sack: BasicEntry;
  /** Safeties. */
  safety: BasicEntry;
  /** Touchdowns. */
  touchdown: BasicEntry;
  /** Turnovers. */
  turnover: TurnoverEntry;
}

/** Data about part of a BQBL score. Some entries have more specific types. */
export declare interface BasicEntry {
  /** The number of occurrences of an event, e.g., 2 safeties. */
  count: number;
  /** The total point value of the events, e.g., 40 points. */
  value: number;
}

/** Data about pass attempts and completions. */
export declare interface CompletionEntry {
  attempts: number;
  completions: number;
  range: Range;
  value: number;
}

export declare interface PasserRatingEntry {
  passers: PasserRating[],
  value: number,
}

/** Stats and rating for an individual passer. */
export declare interface PasserRating {
  /**
   * Human-readable name of the passer. Typically resembles "F.Lname", but might
   * not have a canonical form, so don't depend on any particular format.
   */
  name: string;
  /** The passer rating for this passer. */
  rating: number;
  /** Passing statistics. */
  stats: PasserStats;
  /** The BQBL point value for this rating. */
  value: number;
}

/** Passing statistics. */
export declare interface PasserStats {
  /** Passes attempted. */
  att: number;
  /** Passes completed. */
  cmp: number;
  /** Interceptions thrown. */
  int: number;
  /** Touchdowns thrown. Excludes all non-passing TDs. */
  td: number;
  /** Passing yards. Yards lost to sacks do not count against this. */
  yds: number;
}

/** Data about turnovers. */
export declare interface TurnoverEntry {
  /** The value of the turnovers themselves. */
  baseValue: number;
  /** The bonus points awarded for committing multiple turnovers in a game. */
  bonusValue: number;
  /** The total number of turnovers committed. */
  count: number;
  /** More details about the types of turnovers committed. */
  types: TurnoverTypes;
  /** The total point value, equal to base + bonus. */
  value: number;
}

export declare interface TurnoverTypes {
  /** Fumbles lost. */
  fuml: number;

  /**
   * Fumbles lost for TD. These are already included in the total fumbles lost
   * count above.
   */
  fum6: number;

  /** Interceptions. */
  int: number;

  /**
   * Interceptions returned for TD. These are already included in the total
   * interception count above.
   */
  int6: number;

  /**
   * Game-losing turnovers in overtime. This is already included in the
   * appropriate turnover-for-TD count above.
   */
  ot6: number;
}

/** Data about yardage-related metrics. */
export declare interface YardageEntry {
  yards: number;
  value: number;
  range: Range;
}

/**
 * A numeric range. Doesn't carry information about whether the endpoints are
 * open or closed, but maybe it should.
 */
export declare interface Range {
  min: number;
  max: number;
}

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Bet = {
  __typename?: 'Bet';
  betOptions?: Maybe<Array<Maybe<BetOption>>>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  marketOptionId: Scalars['ID'];
  potentialWinnings: Scalars['Float'];
  stake: Scalars['Float'];
  status: BetStatus;
  user?: Maybe<User>;
  userId: Scalars['ID'];
};

export type BetOption = {
  __typename?: 'BetOption';
  bet: Bet;
  id: Scalars['Int'];
  marketOption: MarketOption;
};

export enum BetStatus {
  Canceled = 'CANCELED',
  Lost = 'LOST',
  Pending = 'PENDING',
  Won = 'WON'
}

/** An Event represents a sports match or competition on which users can place bets. */
export type Event = {
  __typename?: 'Event';
  awayTeamName: Scalars['String'];
  /** Is this event completed? */
  completed: Scalars['Boolean'];
  /** The id of the event in the source system. */
  externalId?: Maybe<Scalars['String']>;
  homeTeamName: Scalars['String'];
  id: Scalars['ID'];
  /** Is this event currently live? */
  isLive: Scalars['Boolean'];
  markets?: Maybe<Array<Maybe<Market>>>;
  name: Scalars['String'];
  scoreUpdates?: Maybe<Array<Maybe<ScoreUpdate>>>;
  sport: Sport;
  startTime: Scalars['String'];
};


/** An Event represents a sports match or competition on which users can place bets. */
export type EventMarketsArgs = {
  source?: InputMaybe<Scalars['String']>;
};

/**
 * A Market represents a specific betting opportunity within an event.
 * It's usually associated with one aspect of the event that users can bet on.
 * A single event can have multiple markets. Some common examples of markets
 * include Moneyline, Point Spread, and Totals (Over/Under).
 */
export type Market = {
  __typename?: 'Market';
  event?: Maybe<Event>;
  id: Scalars['ID'];
  /** Is this Market available for live betting? */
  isLive: Scalars['Boolean'];
  /**
   * When was this Market last updated? Used to track when the odds were last
   * updated during live betting.
   */
  lastUpdated?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  options?: Maybe<Array<Maybe<MarketOption>>>;
  /** What is the source or bookmaker that provides the odds for this Market? */
  source: Scalars['String'];
};

/**
 * A MarketOption represents a specific choice or outcome within a market
 * that users can bet on. Each market typically has two or more options to choose from.
 */
export type MarketOption = {
  __typename?: 'MarketOption';
  id: Scalars['ID'];
  /**
   * When was this Market last updated? Used to track when the odds were last
   * updated during live betting.
   */
  lastUpdated?: Maybe<Scalars['String']>;
  market?: Maybe<Market>;
  name: Scalars['String'];
  odds: Scalars['Float'];
};

/**  Mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /**  should be available for admins only: */
  createEvent?: Maybe<Event>;
  createMarket?: Maybe<Market>;
  createMarketOption?: Maybe<MarketOption>;
  createUser?: Maybe<User>;
  depositFunds?: Maybe<Wallet>;
  placeBet?: Maybe<Bet>;
  withdrawFunds?: Maybe<Wallet>;
};


/**  Mutations */
export type MutationCreateEventArgs = {
  name: Scalars['String'];
  sport: Scalars['String'];
  startTime: Scalars['String'];
};


/**  Mutations */
export type MutationCreateMarketArgs = {
  eventId: Scalars['ID'];
  name: Scalars['String'];
};


/**  Mutations */
export type MutationCreateMarketOptionArgs = {
  marketId: Scalars['ID'];
  name: Scalars['String'];
  odds: Scalars['Float'];
};


/**  Mutations */
export type MutationCreateUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


/**  Mutations */
export type MutationDepositFundsArgs = {
  amount: Scalars['Float'];
  userId: Scalars['ID'];
};


/**  Mutations */
export type MutationPlaceBetArgs = {
  marketOptions: Array<Scalars['ID']>;
  stake: Scalars['Float'];
  userId: Scalars['ID'];
};


/**  Mutations */
export type MutationWithdrawFundsArgs = {
  amount: Scalars['Float'];
  userId: Scalars['ID'];
};

/**  Queries */
export type Query = {
  __typename?: 'Query';
  getBet?: Maybe<Bet>;
  getEvent?: Maybe<Event>;
  getMarket?: Maybe<Market>;
  getUser?: Maybe<User>;
  listBets?: Maybe<Array<Maybe<Bet>>>;
  listEvents?: Maybe<Array<Maybe<Event>>>;
  listLiveEvents?: Maybe<Array<Maybe<Event>>>;
  listLiveMarkets?: Maybe<Array<Maybe<Market>>>;
  listMarkets?: Maybe<Array<Maybe<Market>>>;
};


/**  Queries */
export type QueryGetBetArgs = {
  id: Scalars['ID'];
};


/**  Queries */
export type QueryGetEventArgs = {
  id: Scalars['ID'];
};


/**  Queries */
export type QueryGetMarketArgs = {
  id: Scalars['ID'];
};


/**  Queries */
export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


/**  Queries */
export type QueryListBetsArgs = {
  userId: Scalars['ID'];
};


/**  Queries */
export type QueryListLiveMarketsArgs = {
  eventId: Scalars['ID'];
};


/**  Queries */
export type QueryListMarketsArgs = {
  eventId: Scalars['ID'];
};

export type ScoreUpdate = {
  __typename?: 'ScoreUpdate';
  event: Event;
  id: Scalars['ID'];
  name: Scalars['String'];
  score: Scalars['String'];
  timestamp: Scalars['String'];
};

export type Sport = {
  __typename?: 'Sport';
  /** Is this sport in season at the moment? */
  active: Scalars['Boolean'];
  description: Scalars['String'];
  group: Scalars['String'];
  /** Does this sport have outright markets? */
  hasOutrights: Scalars['Boolean'];
  id: Scalars['ID'];
  key: Scalars['String'];
  title: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  eventScoresUpdated?: Maybe<Array<Maybe<Event>>>;
  eventStatusUpdated?: Maybe<Array<Maybe<Event>>>;
  liveMarketOptionsUpdated?: Maybe<Array<Maybe<MarketOption>>>;
};

export type Transaction = {
  __typename?: 'Transaction';
  amount: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  transactionType: TransactionType;
  wallet?: Maybe<Wallet>;
};

export enum TransactionType {
  BetPlaced = 'BET_PLACED',
  BetRefunded = 'BET_REFUNDED',
  BetWon = 'BET_WON',
  Deposit = 'DEPOSIT',
  Withdrawal = 'WITHDRAWAL'
}

export type User = {
  __typename?: 'User';
  bets?: Maybe<Array<Maybe<Bet>>>;
  email: Scalars['String'];
  id: Scalars['ID'];
  password: Scalars['String'];
  username: Scalars['String'];
  wallet?: Maybe<Wallet>;
};

export type Wallet = {
  __typename?: 'Wallet';
  balance: Scalars['Float'];
  id: Scalars['ID'];
  transactions?: Maybe<Array<Maybe<Transaction>>>;
  user?: Maybe<User>;
  userId: Scalars['ID'];
};

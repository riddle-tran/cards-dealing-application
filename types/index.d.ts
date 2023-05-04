export {};

declare global {
  type Suit = 'H' | 'D' | 'C' | 'S';

  type Rank =
    | 'A'
    | '2'
    | '3'
    | '4'
    | '5'
    | '6'
    | '7'
    | '8'
    | '9'
    | 'T'
    | 'J'
    | 'Q'
    | 'K';

  // eslint-disable-next-line no-unused-vars
  type BackFace = '1B' | '1R';

  // eslint-disable-next-line no-unused-vars
  type Deck = `${Rank}${Suit}`;
}

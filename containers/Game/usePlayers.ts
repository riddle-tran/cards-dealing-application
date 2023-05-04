import { CardHandle } from '@/components/Card';
import { RANKS, SUITS } from '@/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UsePlayersOptions {
  numPlayers?: number;
}

interface ICard {
  suit: Suit;
  rank: Rank;
}

export function usePlayers({ numPlayers = 4 }: UsePlayersOptions) {
  // Chia bài cho các người chơi
  const numCards = 13;

  const [players, setPlayers] = useState<
    Array<Array<ICard & { ref: CardHandle | null }>>
  >([]);
  const cardRefs = useRef(
    RANKS.map(() => {
      return [...Array(numPlayers)].map(() => null);
    })
  );

  // Xáo trộn deck
  function shuffle(deck: ICard[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const dealCardsToPlayer = useCallback(
    async (numCard: number, player: number, ref: CardHandle | null) => {
      let translateX: number | undefined = undefined;
      let translateY: number | undefined = undefined;
      let rotateRange: [number, number] = [0, 0];
      const width = window.innerWidth / 4;
      const height = window.innerHeight / 4;

      switch (player) {
        case 0:
          translateY = -height;
          rotateRange = [
            randomIntFromInterval(350, 360),
            randomIntFromInterval(10, 45),
          ];
          break;
        case 1:
          translateX = width;
          rotateRange = [
            randomIntFromInterval(45, 85),
            randomIntFromInterval(95, 135),
          ];
          break;
        case 2:
          translateY = height;
          rotateRange = [
            randomIntFromInterval(175, 185),
            randomIntFromInterval(195, 225),
          ];
          break;
        case 3:
          translateX = -width;
          rotateRange = [
            randomIntFromInterval(225, 280),
            randomIntFromInterval(290, 315),
          ];
          break;
        default:
          translateY = -height;
          rotateRange = [
            randomIntFromInterval(315, 350),
            randomIntFromInterval(0, 45),
          ];
          break;
      }

      return new Promise((resolve) => {
        ref?.dealCardsToPlayers({
          zIndex: RANKS.length - numCard + 1,
          translateX,
          rotateRange,
          translateY,
          callBack: resolve,
        });
      });
    },
    []
  );

  useEffect(() => {
    const deck: ICard[] = [];
    const players: Array<Array<ICard & { ref: any }>> = [];
    // Tạo một deck bài gồm 52 lá bài
    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        deck.push({ suit: suit, rank: rank });
      });
    });
    shuffle(deck); // Xáo trộn deck

    for (let i = 0; i < numPlayers; i++) {
      players[i] = [];
    }

    for (let i = 0; i < numCards; i++) {
      for (let j = 0; j < numPlayers; j++) {
        const player = deck.pop() as ICard;
        players[j].push({ ...player, ref: cardRefs.current[i][j] });
      }
    }

    setPlayers(players);
  }, [numPlayers]);

  return {
    players,
    numCards,
    numPlayers,
    dealCardsToPlayer,
  };
}

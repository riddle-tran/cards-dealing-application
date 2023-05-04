import Card from '@/components/Card';
import { RANKS } from '@/constants';
import { usePlayers } from './usePlayers';
import { useCallback, useState } from 'react';

export default function Game() {
  const [played, setPlayed] = useState(false);
  const { players, numCards, numPlayers, dealCardsToPlayer } = usePlayers({});

  const handleDealCardsToPlayers = useCallback(async () => {
    setPlayed(true);
    RANKS.forEach((_, iRank) => {
      players.forEach((player) => {
        const { ref } = player[iRank];
        ref?.preDealCardsToPlayers();
      });
    });

    for (let i = numCards - 1; i >= 0; i--) {
      for (let j = numPlayers - 1; j >= 0; j--) {
        await dealCardsToPlayer(i, j, players[j][i].ref);
      }
    }

    RANKS.forEach((_, iRank) => {
      players.forEach((player, iPlayer) => {
        const { ref } = player[iRank];
        ref?.showCards(iPlayer);
      });
    });
  }, [dealCardsToPlayer, numCards, numPlayers, players]);

  return (
    <div>
      {RANKS.map((_, iRank) => {
        return players.map((player, iPlayer) => {
          const { suit, rank } = player[iRank];
          return (
            <Card
              ref={(element) => {
                player[iRank].ref = element;
              }}
              rank={rank}
              suit={suit}
              key={`${rank}${suit}`}
              order={iPlayer * RANKS.length + iRank}
            />
          );
        });
      })}

      <div className='fixed bottom-5 left-5'>
        <button
          onClick={handleDealCardsToPlayers}
          disabled={played}
          className='disabled:bg-gray-400 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
        >
          Play
        </button>
      </div>
    </div>
  );
}

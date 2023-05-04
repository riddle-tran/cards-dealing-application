/* eslint-disable no-unused-vars */
import { BACK_FACE, RANKS } from '@/constants';
import anime from 'animejs';
import Image from 'next/image';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface CardProps {
  rank: Rank;
  suit: Suit;
  order: number;
}

interface DealCardsToPlayerParams {
  zIndex: number;
  rotateRange: [number, number];
  translateX?: number;
  translateY?: number;
  callBack?: (value: unknown) => void;
}
export interface CardHandle {
  preDealCardsToPlayers: () => void;
  dealCardsToPlayers: (deal: DealCardsToPlayerParams) => void;
  showCards: (iPlayer: number) => void;
}

const Card = forwardRef<CardHandle, CardProps>(function Card(
  { rank, suit, order },
  ref
) {
  const [isBackFace, setBackFace] = useState(true);
  const selfRef = useRef<HTMLDivElement | null>(null);
  const infoRef = useRef<DealCardsToPlayerParams>();
  const translate = useRef<number>();

  const handleDealCardsToPlayer = useCallback(() => {
    anime({
      targets: selfRef.current,
      translateY: infoRef.current?.translateY,
      translateX: infoRef.current?.translateX,
      duration: 250,
      easing: 'linear',
      complete: () => {
        anime.remove(selfRef.current);
        infoRef.current?.callBack?.(undefined);
      },
    });
  }, []);

  const handleShow = useCallback((iPlayer: number) => {
    if (iPlayer !== 2) return;
    const zIndex = RANKS.length / 2 - (infoRef.current?.zIndex ?? 0);
    const translateX = -zIndex * 20;

    anime({
      targets: selfRef.current,
      translateX,
      duration: 250,
      easing: 'linear',
      complete: () => {
        anime.remove(selfRef.current);
        setBackFace(false);
      },
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      preDealCardsToPlayers: () => {
        if (!selfRef.current) return;
        anime({
          targets: selfRef.current,
          translateX: 0,
          translateY: 0,
          rotate: '360deg',
          loop: true,
          duration: 720,
          easing: 'linear',
          update: () => {
            if (infoRef.current) {
              const { rotateRange } = infoRef.current;
              const rotate = anime.get(selfRef.current, 'rotate') as string;
              const numericValue = parseFloat(rotate);
              if (
                (numericValue > rotateRange[0] &&
                  numericValue < rotateRange[1]) ||
                (rotateRange[0] > rotateRange[1] &&
                  (numericValue > rotateRange[0] ||
                    numericValue < rotateRange[1]))
              ) {
                anime.remove(selfRef.current);
                if (selfRef.current && infoRef.current?.zIndex) {
                  selfRef.current.style.zIndex = String(
                    infoRef.current?.zIndex
                  );
                }
                handleDealCardsToPlayer();
              }
            }
          },
        });
      },
      dealCardsToPlayers: (deal) => {
        if (!selfRef.current) return;
        infoRef.current = deal;
      },
      showCards: (iPlayer) => {
        if (!selfRef.current) return;
        anime({
          targets: selfRef.current,
          rotate: iPlayer === 1 || iPlayer === 3 ? 90 : 0,
          duration: 250,
          easing: 'linear',
          complete: () => {
            if (selfRef.current) {
              anime.remove(selfRef.current);
            }
            handleShow(iPlayer);
          },
        });
      },
    }),
    [handleDealCardsToPlayer, handleShow]
  );

  const src = useMemo(() => {
    return isBackFace && (suit === 'C' || suit === 'S')
      ? BACK_FACE['1B']
      : isBackFace
      ? BACK_FACE['1R']
      : `${rank}${suit}`;
  }, [isBackFace, rank, suit]);

  return (
    <div
      ref={selfRef}
      style={{
        transform: `translate(${order / 5}px, ${-order / 5}px)`,
      }}
      className={'custom-card'}
    >
      <Image
        className='dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert'
        src={`/pokers/${src}.svg`}
        alt='Next.js Logo'
        width={(5 / 7) * 100}
        height={100}
        priority
      />
    </div>
  );
});

export default Card;

import * as React from 'react';
import styled from 'styled-components';
import { useCarousel } from '../hooks/useCarousell';

const Carousell = styled.div`
  position: relative;
  overflow: hidden;
`;

const CarouselIndicators = styled.ol`
  position: absolute;
  right: 0;
  bottom: 0.5em;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  padding-left: 0;
  list-style: none;
  margin: 0 auto;
`;

const CarouselIndicator = styled.li`
  position: relative;
  flex: 0 1 auto;
  width: 1.5em;
  height: 0.3em;
  margin: 0 0.3em;
  background: black;
  cursor: pointer;

  &:hover {
    background: grey;
  }

  &.active {
    background: blue;
    cursor: default;
  }
`;

const CarousellContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: hidden;
  position: relative;
`;

const CarousellItem = styled.div`
  width: 100%;
  margin: 0 0.5em;
`;

function makeIndices(start: number, delta: number, num: number) {
  const indices: Array<number> = [];

  while (indices.length < num) {
    indices.push(start);
    start += delta;
  }

  return indices;
}

export interface CarouselContainerProps {
  children: React.ReactNode;
  interval?: number;
  slidesPresented?: number;
}

//@ts-ignore
export const CarouselContainer: React.FC<CarouselContainerProps> = ({
  children,
  slidesPresented = 3,
  interval = 500000,
}) => {
  const slides = React.Children.toArray(children);
  const length = slides.length;
  const numActive = Math.min(length, slidesPresented);
  const [active, setActive, handlers, style] = useCarousel(length, interval, { slidesPresented: numActive });
  const beforeIndices = makeIndices(slides.length - 1, -1, numActive);
  const afterIndices = makeIndices(0, +1, numActive);

  return (
    length > 0 && (
      <Carousell>
        <CarouselIndicators>
          {slides.map((_, index) => (
            <CarouselIndicator
              onClick={() => setActive(index)}
              key={index}
              className={`${active === index ? 'active' : ''}`}
            />
          ))}
        </CarouselIndicators>
        <CarousellContent {...handlers} style={style}>
          {beforeIndices.map(i => (
            <CarouselChild key={i}>{slides[i]}</CarouselChild>
          ))}
          {slides.map((slide, index) => (
            <CarouselChild key={index}>{slide}</CarouselChild>
          ))}
          {afterIndices.map(i => (
            <CarouselChild key={i}>{slides[i]}</CarouselChild>
          ))}
        </CarousellContent>
      </Carousell>
    )
  );
};

export interface CarouselChildProps {
    children: React.ReactNode;
}

export const CarouselChild: React.FC<CarouselChildProps> = ({ children }) => (
  <CarousellItem>{children}</CarousellItem>
);
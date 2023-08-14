import { ReactElement, useEffect, useRef, useState } from "react";
import { data } from "./constant";

export const useCarousel = () => {
  const [displayStories, setDisplayStories] = useState(data);
  const [imagePosition, setImagePosition] = useState(
    new Map(data.map((i) => [i.id, 0]))
  );
  const [cellSize, setCellSize] = useState(480);

  const [currentStory, setCurrentStory] = useState(data[0].id);
  const hold = useRef(0);
  const radiusRef = useRef(240 / Math.tan(Math.PI / 4));

  const carouselRef = useRef<HTMLDivElement | null>(null);
  const currentStoryRef = useRef(data[0].id);
  const [radius, setRadius] = useState(240 / Math.tan(Math.PI / 4));

  let isDown = false;
  let current = 0;
  let rotateYref = 0;

  const nextImage = () => {
    const currentStoryIndex = getCurrentIndex(currentStoryRef);
    const currentPosition = imagePosition.get(currentStoryRef.current) || 0;
    const storyLength =
      data.find((_data) => _data.id === currentStoryRef.current)?.images
        .length || 0;

    if (
      isLast(currentStoryIndex, data.length) &&
      isLast(currentPosition, storyLength)
    ) {
      return;
    }

    if (!isLast(currentPosition, storyLength)) {
      setImagePosition(
        new Map(imagePosition.set(currentStoryRef.current, currentPosition + 1))
      );
    } else {
      nextStory(currentStoryIndex);
    }
  };

  const prevImage = () => {
    const currentPosition = imagePosition.get(currentStoryRef.current) || 0;
    const currentStoryIndex = getCurrentIndex(currentStoryRef);

    if (isFirst(currentStoryIndex) && isFirst(currentPosition)) {
      return;
    }
    if (!isFirst(currentPosition)) {
      setImagePosition(
        new Map(imagePosition.set(currentStoryRef.current, currentPosition - 1))
      );
    } else {
      prevStory(currentStoryIndex);
    }
  };

  const prevStory = (currentStoryIndex: number) => {
    setCurrentStory(data[currentStoryIndex - 1].id);
    rotateYref = hold.current + 90;
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateZ(-${
        radiusRef.current
      }px) rotateY(${hold.current + 90}deg)`;
    }

    hold.current = hold.current + 90;
  };

  const nextStory = (currentStoryIndex: number) => {
    setCurrentStory(data[currentStoryIndex + 1].id);
    rotateYref = hold.current - 90;
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateZ(-${
        radiusRef.current
      }px) rotateY(${hold.current - 90}deg)`;
    }
    hold.current = hold.current - 90;
  };

  const end = () => {
    isDown = false;
    if (carouselRef.current) {
      carouselRef.current.style.transition = "transform 0.25s";
    }

    const currentStoryIndex = getCurrentIndex(currentStoryRef);
    if (rotateYref > hold.current && !isFirst(currentStoryIndex)) {
      prevStory(currentStoryIndex);
      return;
    }
    if (rotateYref < hold.current && !isLast(currentStoryIndex, data.length)) {
      nextStory(currentStoryIndex);
      return;
    }
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateZ(-${radiusRef.current}px) rotateY(${hold.current}deg)`;
    }
  };

  useEffect(() => {
    currentStoryRef.current = currentStory;
  }, [currentStory]);

  const start = (e: MouseEvent | TouchEvent) => {
    isDown = true;
    current = "pageX" in e ? e.pageX : e.touches[0].pageX;
  };

  const move = (e: MouseEvent | TouchEvent) => {
    if (!isDown || !carouselRef.current) return;
    e.preventDefault();
    carouselRef.current.style.transition = "none";
    const dist = "pageX" in e ? e.pageX : e.touches[0].pageX;
    const threshHold = Math.abs(dist - current);
    const wrap = 3.6666666;
    if (dist >= current) {
      rotateYref = hold.current + threshHold / wrap;
      carouselRef.current.style.transform = `translateZ(-${
        radiusRef.current
      }px) rotateY(${hold.current + threshHold / wrap}deg)`;
    } else {
      rotateYref = hold.current - threshHold / wrap;

      carouselRef.current.style.transform = `translateZ(-${
        radiusRef.current
      }px) rotateY(${hold.current - threshHold / wrap}deg)`;
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateZ(-${radius}px) rotateY(${hold.current}deg)`;
    }
    radiusRef.current = radius;
    console.log(radiusRef);
  }, [radius]);

  useEffect(() => {
    const carousel = document.getElementById("carousel") || ({} as Element);

    if (window.screen.width < 480) {
      setCellSize(window.screen.width);
      setRadius(window.screen.width / 2 / Math.tan(Math.PI / 4));
    }

    if (carousel) {
      carousel.addEventListener("mousedown", start as (e: Event) => void);
      carousel.addEventListener("touchstart", start as (e: Event) => void);

      carousel.addEventListener("mousemove", move as (e: Event) => void);
      carousel.addEventListener("touchmove", move as (e: Event) => void);

      carousel.addEventListener("mouseleave", end);
      carousel.addEventListener("mouseup", end);
      carousel.addEventListener("touchend", end);
    }
  }, []);

  return {
    displayStories,
    nextImage,
    prevImage,
    imagePosition,
    currentStory,
    carouselRef,
    cellSize,
    radius,
  };
};

function getCurrentIndex(currentStory: React.MutableRefObject<string>) {
  return data.findIndex((_data) => _data.id === currentStory.current);
}

export const isLast = (index: number, length: number) => {
  return index === length - 1;
};

export const isFirst = (index: number) => {
  return index === 0;
};

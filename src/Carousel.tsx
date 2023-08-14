import { useEffect, useState } from "react";
import { useCarousel } from "./utils";
import { ProgressBar } from "./ProgressBar";

export const Carousel = () => {
  const {
    displayStories,
    nextImage,
    prevImage,
    imagePosition,
    cellSize,
    carouselRef,
    radius,
  } = useCarousel();

  const theta = 90;

  return (
    <>
      <div
        id="container"
        style={{
          width: cellSize,
          height: window.screen.width > 480 ? cellSize * 1.6 : "100vh",
          backgroundColor: "black",
          cursor: "pointer",
          overflow: "hidden",
        }}
        className="relative"
      >
        <div
          id="scene"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            perspective: 1000,
            width: "100%",
            height: "100%",
          }}
        >
          <div
            id="carousel"
            ref={carouselRef}
            className="image-full absolute preserve-3d"
          >
            {displayStories.map((story, index) => {
              const selectedIndex = imagePosition.get(story.id) || 0;
              return (
                <div
                  key={story.id}
                  className="image-full absolute"
                  style={{
                    transform: `rotateY(${
                      index * theta
                    }deg) translateZ(${radius}px)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 60,
                  }}
                >
                  <ProgressBar story={story} selectedIndex={selectedIndex} />
                  <img
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    src={story.images[selectedIndex]}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

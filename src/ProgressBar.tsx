type Props = {
  story: {
    id: string;
    bgColor: string;
    images: string[];
  };
  selectedIndex: number;
};

export const ProgressBar = ({ story, selectedIndex }: Props) => {
  return (
    <div
      className="absolute flex"
      style={{
        top: 16,
        height: 2,
        zIndex: 10,
        gap: 4,
        paddingLeft: 8,
        paddingRight: 8,
        width: "calc(100% - 16px)",
      }}
    >
      {story.images.map((image, index) => (
        <div
          key={image}
          style={{
            backgroundColor:
              selectedIndex >= index ? "#fff" : "rgba(255, 255, 255, .35)",
            borderRadius: 4,
            width: `calc(100% / ${story.images.length})`,
          }}
        ></div>
      ))}
    </div>
  );
};

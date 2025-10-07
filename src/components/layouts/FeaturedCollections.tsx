import React, { useState, useRef } from "react";
import type { FeaturedCollectionsProps } from "@interfaces/components/featuredCollections";
import "@styles/components/featuredCollections.scss";
import { Button } from "@components/common/Button";
import { ICONS } from "@constants/icons";
import DOMPurify from "dompurify";

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = (
  props
) => {
  const { runway } = props;
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [playingStates, setPlayingStates] = useState<boolean[]>([]);

  React.useEffect(() => {
    setPlayingStates(runway.map(() => true));
  }, [runway]);

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (playingStates[index]) {
      video.pause();
    } else {
      video.play();
    }

    setPlayingStates((prev) =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  };

  return (
    <div className="d-flex flex-col justify-center items-center">
      <div className="featured-collection-wrap">
        {runway.map((item, index) => (
          <div
            key={index}
            className="featured-collection-container d-flex flex-col"
          >
            <div className="featured-collection-video-container d-flex flex-col">
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                autoPlay
                loop
                muted
                className="featured-collection-video"
              >
                <source src={encodeURI(item.video)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div
                className="featured-collection-video-control-container d-flex flex-row justify-center items-center"
                onClick={() => togglePlay(index)}
              >
                <img
                  src={playingStates[index] ? ICONS.pause : ICONS.play}
                  alt=""
                  className="featured-collection-video-control-icon"
                />
              </div>
            </div>
            <div className="featured-collection-video-content d-flex flex-col items-center mt-3">
              <p className="text-font-semibold font-size-md text-uppercase">
                {item.name}
              </p>
              <div className="featured-collection-video-content-description-wrap">
                <p
                  className="featured-collection-video-content-description text-font-light font-size-base"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.description ?? "", {
                      FORBID_ATTR: ["style"],
                    }),
                  }}
                ></p>
              </div>

              <div className="mt-4">
                <Button label={"Discover More"} variant="static-underline" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

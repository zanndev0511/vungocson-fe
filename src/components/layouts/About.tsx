import React from "react";
import { IMAGES } from "@constants/image";
import "@styles/components/about.scss";
import { Button } from "@components/common/Button";

export const About: React.FC = () => {
  return (
    <>
      <div className="flex flex-row mb-3">
        <img
          src={IMAGES.vungocson2}
          alt="About VUNGOC&SON"
          className="about-image"
        />
        <div className="flex flex-col justify-center items-center mt-3 about-container ml-3">
          <p className="text-uppercase text-font-semibold font-size-xl">
            VUNGOC<span className="text-font-semibold font-size-sm">&</span>SON
          </p>
          <p className="text-font-light font-size-base text-center about-content mt-3">
            Vungoc&Son (stylized as VUNGOC&SON), is the common name of the
            Vietnamese fashion designer duo including members Vu Ngoc Tu and
            Dinh Truong Tung , is also the name of the fashion brand that the
            two co-founded and own. The press commented that the two were the
            "color wizard duo" of the Vietnamese fashion world because their
            designs made a mark with a series of pop art-style costumes with
            vibrant colors and patterns, and interference. between Eastern and
            Western cultures.
          </p>
          <Button label={"See more"} className="text-font-regular-italic" variant="static-underline"/>
          <img
            src={IMAGES.vungocson}
            alt="About VUNGOC&SON"
            className="about-image"
          />
        </div>
      </div>
    </>
  );
};

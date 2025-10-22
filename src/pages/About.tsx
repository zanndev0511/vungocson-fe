import React from "react";
import Header from "@components/common/Header";
import "@styles/pages/about.scss";
import Footer from "@components/common/Footer";
import { IMAGES } from "@constants/image";

export const About: React.FC = () => {
  return (
    <>
      <Header backgroundColor="black" />
      <div className="about">
        <div className="about-container d-flex flex-col items-center justify-center text-font-regular width-fullsize">
          <div className="about-image-container width-fullsize gap-2">
            <div className="about-image-logo-wrap">
              {Array.from({ length: 60 }).map((_, i) => (
                <img key={i} src={IMAGES.blackLogo} alt="" />
              ))}
            </div>
            <div className="about-content-container">
              <div className="about-content">
                <div className="about-content-wrap">
                  <div className="about-content-title">
                    <p className="text-font-semibold font-size-base text-center">
                      THE ART OF COLOR AND EMOTION
                    </p>
                    <div className="d-flex flex-col gap-3 mt-3">
                      <p className="text-font-regular font-size-sm text-center">
                        Each{" "}
                        <span className="text-font-semibold">VUNGOC&SON</span>{" "}
                        collection is a poetic fusion of Vietnamese culture,
                        nature, and contemporary aesthetics, creating a
                        distinctive and recognizable design language.
                      </p>
                      <p className="text-font-regular font-size-sm text-center">
                        The brand is celebrated for its vivid color palettes,
                        bold silhouettes, and meticulous hand embroidery —
                        balancing structure and fluidity, art and craftsmanship
                        in perfect harmony.
                      </p>
                      <p className="text-font-regular font-size-sm text-center">
                        The designers often share:
                      </p>
                      <p className="text-font-semibold-italic font-size-base text-center">
                        “We create fashion as a way to tell stories about
                        Vietnam — its beauty, emotions, and people.”
                      </p>
                    </div>
                  </div>
                </div>
                <div className="about-image-wrap">
                  <img src={IMAGES.vungocson1} alt="" />
                </div>
                <div className="about-content-wrap">
                  <div className="about-content-title">
                    <p className="text-font-semibold font-size-base text-center">
                      WHEN FASHION BECOMES THE LANGUAGE OF LIGHT
                    </p>
                    <div className="d-flex flex-col gap-3 mt-3">
                      <p className="text-font-regular font-size-sm text-center">
                        Their work has been featured in leading fashion
                        publications such as Harper’s Bazaar, L’Officiel, and
                        Elle, affirming their place among Vietnam’s top couture
                        designers and highlighting their influence on the global
                        fashion scene.
                      </p>
                      <p className="text-font-regular font-size-sm text-center">
                        Each garment is not merely fashion — it is an artistic
                        statement, where creative passion, cultural pride, and
                        modern elegance converge to illuminate the beauty of
                        Vietnamese women and the soul of Vietnam.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="about-content-wrap-mobile">
                  <div className="about-content-title">
                    <p className="text-font-semibold font-size-base text-center">
                      THE ART OF COLOR AND EMOTION
                    </p>
                    <div className="d-flex flex-col gap-3 mt-3">
                      <p className="text-font-regular font-size-sm text-center">
                        Each{" "}
                        <span className="text-font-semibold">VUNGOC&SON</span>{" "}
                        collection is a poetic fusion of Vietnamese culture,
                        nature, and contemporary aesthetics, creating a
                        distinctive and recognizable design language.
                      </p>
                      <p className="text-font-regular font-size-sm text-center">
                        The brand is celebrated for its vivid color palettes,
                        bold silhouettes, and meticulous hand embroidery —
                        balancing structure and fluidity, art and craftsmanship
                        in perfect harmony.
                      </p>
                      <p className="text-font-regular font-size-sm text-center">
                        The designers often share:
                      </p>
                      <p className="text-font-semibold-italic font-size-sm text-center">
                        “We create fashion as a way to tell stories about
                        Vietnam — its beauty, emotions, and people.”
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="about-content-title">
                      <p className="text-font-semibold font-size-base text-center">
                        WHEN FASHION BECOMES THE LANGUAGE OF LIGHT
                      </p>
                      <div className="d-flex flex-col gap-3 mt-3">
                        <p className="text-font-regular font-size-sm text-center">
                          Their work has been featured in leading fashion
                          publications such as Harper’s Bazaar, L’Officiel, and
                          Elle, affirming their place among Vietnam’s top
                          couture designers and highlighting their influence on
                          the global fashion scene.
                        </p>
                        <p className="text-font-regular font-size-sm text-center">
                          Each garment is not merely fashion — it is an artistic
                          statement, where creative passion, cultural pride, and
                          modern elegance converge to illuminate the beauty of
                          Vietnamese women and the soul of Vietnam.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="about-section-container mt-3">
            <div className="about-section-image-wrap">
              <img
                src={IMAGES.vungocson4}
                alt=""
                className="about-section-image"
              />
            </div>
            <div className="about-section-content d-flex flex-col items-center">
              <p className="text-font-semibold font-size-md text-center">
                VUNGOC&SON – WHERE CULTURE MEETS ART
              </p>
              <div className="d-flex flex-col items-center gap-3 mt-4">
                <p className="text-font-light font-size-sm">
                  <span className="text-font-semibold font-size-sm text-center">
                    VUNGOC&SON’s
                  </span>{" "}
                  fashion shows are renowned for being staged in one-of-a-kind
                  locations — from the iconic Golden Bridge in Da Nang to
                  historic theaters, museums, and Vietnam’s natural and cultural
                  landmarks.
                </p>
                <p className="text-font-light font-size-sm text-center">
                  Each show becomes more than a fashion event; it transforms
                  into a living canvas that celebrates the beauty, heritage, and
                  spirit of Vietnam.
                </p>
                <p className="text-font-light font-size-sm text-center">
                  With deep love for their homeland, designers{" "}
                  <span className="text-font-semibold">Vu Ngoc Tu</span> and{" "}
                  <span className="text-font-semibold">Dinh Truong Tung</span>{" "}
                  are devoted to sharing the image of Vietnam with the world
                  through the universal language of fashion, art, and emotion.
                </p>
                <p className="text-font-light font-size-sm text-center">
                  <span className="text-font-semibold">VUNGOC&SON</span> do not
                  simply create collections; they craft cultural moments, where
                  tradition meets modernity, and fashion transforms into art.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-col items-center width-fullsize mt-4">
        <p className="text-font-semibold font-size-3xl text-center">THE ESSENCE</p>
        <div className="about-essence mt-4">
          <div className="about-essence-image-wrap">
            <img src={IMAGES.essence1} alt="" className="about-essence-image" />
          </div>
          <div className="about-essence-image-wrap">
            <img src={IMAGES.essence2} alt="" className="about-essence-image" />
          </div>
          <div className="about-essence-image-wrap">
            <img src={IMAGES.essence4} alt="" className="about-essence-image" />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};

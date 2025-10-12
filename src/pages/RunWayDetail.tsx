import runwayApi from "@api/services/runwayApi";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { ICONS } from "@constants/icons";
import type { Runway } from "@interfaces/pages/runway";
import "@styles/pages/runWayDetail.scss";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export const RunWayDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [runway, setRunway] = useState<Runway>();

  const totalPages = runway?.celebs ? Math.ceil(runway.celebs.length / 3) : 0;

  useEffect(() => {
    if (trackRef.current && carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const offset = currentPage * containerWidth;
      trackRef.current.style.transform = `translateX(-${offset}px)`;
    }
  }, [currentPage]);

  const next = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    const section = document.querySelector(".runwayDetail-carousel-container");
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("active");
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const openVideoModal = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  useEffect(() => {
    const fetchRunwayById = async (): Promise<Runway | undefined> => {
      try {
        if (!id) return;
        const fetchedRunway: Runway = await runwayApi.getById(id);

        if (Array.isArray(fetchedRunway.celebs)) {
          fetchedRunway.celebs.sort(
            (a, b) =>
              new Date(a.createdAt!).getTime() -
              new Date(b.createdAt!).getTime()
          );
        }

        setRunway(fetchedRunway);
      } catch (err) {
        console.error("Error fetching banner by id:", err);
        setRunway({} as Runway);
      }
    };
    fetchRunwayById();
  }, [id]);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="runwayDetail d-flex flex-col items-center">
        <div className="runwayDetail-banner-container d-flex flex-col items-center">
          <img
            src={runway?.banners[0]}
            alt=""
            className="runwayDetail-banner"
          />
          <div className="runwayDetail-banner-overlay" />
          <div className="runwayDetail-banner-content d-flex flex-col items-center justify-center">
            <p className="runwayDetail-banner-content-title text-font-semibold font-size-3xl text-uppercase">
              {runway?.name}
            </p>
            <button
              className="runwayDetail-banner-button d-flex flex-row justify-center items-center"
              onClick={openVideoModal}
            >
              <img
                src={ICONS.play}
                alt=""
                className="runwayDetail-banner-button-icon"
              />
              <p className="text-font-semibold font-size-sm ml-2">
                SEE THE FILM
              </p>
            </button>
          </div>
        </div>
        <div className="runwayDetail-carousel-container d-flex flex-col items-center">
          <div className="runwayDetail-carousel d-flex flex-col items-center p-3">
            <div className="d-flex flex-row justify-center items-center">
              <img
                src={ICONS.left}
                alt="prev"
                className="runwayDetail-carousel-icon cursor-pointer"
                onClick={prev}
              />

              <div className="runwayDetail-carousel-window">
                <div
                  className="runwayDetail-carousel-track"
                  style={{ transform: `translateX(-${currentPage * 100}%)` }}
                >
                  {runway?.celebs.map((celeb, idx) => (
                    <img
                      key={idx}
                      src={celeb.image}
                      alt={`img-${idx}`}
                      className="runwayDetail-carousel-image"
                    />
                  ))}
                </div>
              </div>

              <img
                src={ICONS.right}
                alt="next"
                className="runwayDetail-carousel-icon"
                onClick={next}
              />
            </div>

            <div className="runwayDetail-carousel-steps mt-4">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <div
                  key={idx}
                  className={`runwayDetail-carousel-step ${
                    idx === currentPage ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(idx)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="runwayDetail-description d-flex flex-col items-center gap-3">
          <p className="text-font-semibold font-size-xl">{runway?.name}</p>
          <p
            className="text-font-regular font-size-base"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(runway?.description ?? "", {
                FORBID_ATTR: ["style"],
              }),
            }}
          ></p>
        </div>
        <div className="runwayDetail-product p-2 mt-5">
          {runway?.galleries.map((item) => (
            <img
              key={item.id}
              src={item.image! || ""}
              alt=" "
              className="runwayDetail-product-image"
              onClick={() =>
                navigate(
                  `/shop/product/${item.product?.id}/${item.product?.slug}`
                )
              }
            />
          ))}
        </div>
      </div>

      {showVideoModal && (
        <div className="video-modal-overlay" onClick={closeVideoModal}>
          <div
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={ICONS.cancel}
              alt=""
              className="video-modal-close"
              onClick={closeVideoModal}
            />
            <video
              width="100%"
              height="100%"
              autoPlay
              controls
              poster={runway?.banners[0]}
            >
              <source src={runway?.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      <div className="mt-3">
        <Footer />
      </div>
    </>
  );
};

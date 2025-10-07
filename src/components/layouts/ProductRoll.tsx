import React from "react";
import "@styles/components/productRoll.scss";
import type { ProductRollProps } from "@interfaces/components/productRoll";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

const ProductRoll: React.FC<ProductRollProps> = (props) => {
  const { className, runwayFeature } = props;
  const navigate = useNavigate();

  const allImages = (runwayFeature?.galleries ?? [])
    .filter((p) => p.status === "active")
    .flatMap((p) => p.image || []);

  return (
    <div className="collection-container mt-3">
      <div className="collection-intro-container gap-4 fullsize">
        <video
          src={runwayFeature?.video}
          controls
          autoPlay
          loop
          muted
          className="collection-video"
        />
        <div className="collection-content">
          <p className="text-uppercase text-font-bold text-color font-size-lg">
            {runwayFeature?.name}
          </p>
          <p
            className="collection-intro-description font-size-base text-font-light text-color"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(runwayFeature?.description ?? "", {
                FORBID_ATTR: ["style"],
              }),
            }}
          ></p>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center mt-4 relative">
        <div className={`collection-carousel ${className}`}>
          <div className="collection-carousel-title">
            <p className="text-uppercase text-font-bold font-size-xl">
              {runwayFeature?.collection?.name}
            </p>
            <button
              className="collection-button text-font-light p-2 m-3"
              onClick={() => navigate("/collection")}
            >
              Discover More
            </button>
          </div>
          <div className="collection-carousel-wrap gap-2">
            {allImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                className="collection-carousel-image"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductRoll;

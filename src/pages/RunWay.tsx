import React, { useEffect, useState } from "react";
import "@styles/pages/runway.scss";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import { useNavigate } from "react-router-dom";
import type { Runway } from "@interfaces/pages/runway";
import runwayApi from "@api/services/runwayApi";

export const RunWay: React.FC = () => {
  const navigate = useNavigate();

  const [runways, setRunways] = useState<Runway[]>([]);

  const fetchRunway = async () => {
    try {
      const response = await runwayApi.getAll();
      const items: Runway[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const activeItems = items.filter((item) => item.status === "active");
      setRunways(activeItems);
    } catch (error) {
      console.error("Failed to fetch Runway:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchRunway();
  }, []);

  return (
    <>
    <Header backgroundColor="black" />
      <div className="runway d-flex flex-col">
        {runways.map((item) => (
          <div className="runway-banner-container d-flex flex-col items-center">
            <img src={item.banners[0]} alt="" className="runway-banner" />
            <div className="runway-banner-overlay" />
            <div className="runway-banner-content d-flex flex-col items-center">
              <p className="runway-banner-content-title text-font-semibold font-size-3xl text-uppercase">
                {item.name}
              </p>
              <button className="runway-banner-button text-font-semibold font-size-base" onClick={() => navigate(`/runway/${item.id}/${item.slug}`)}>
                SEE MORE
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

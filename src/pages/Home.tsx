import React, { useEffect, useState } from "react";

import "@styles/pages/home.scss";
import { IMAGES } from "@constants/image";
import TopNavigation from "@components/common/TopNavigation";
import ProductRoll from "@components/layouts/ProductRoll";
import Carousel from "@components/layouts/Carousel";
import { FeaturedCollections } from "@components/layouts/FeaturedCollections";
import { Button } from "@components/common/Button";
import News from "@components/layouts/News";
import Footer from "@components/common/Footer";
import Header from "@components/common/Header";
import { useNavigate } from "react-router-dom";
import { ICONS } from "@constants/icons";
import { ContactUs } from "@components/layouts/ContactUs";
import type { Banners } from "@interfaces/components/banner";
import bannerApi from "@api/services/bannerApi";
import Banner from "@components/layouts/Banner";
import runwayApi from "@api/services/runwayApi";
import type { Runway } from "@interfaces/pages/runway";
import type { Product } from "@interfaces/pages/product";
import productApi from "@api/services/productApi";
import type { NewsData } from "@interfaces/components/news";
import newsApi from "@api/services/newsApi";

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const [openContact, setOpenContact] = useState<boolean>(false);
  const [banners, setBanners] = useState<string[]>([]);
  const [runway, setRunway] = useState<Runway[]>([]);
  const [runwayFeature, setRunwayFeature] = useState<Runway>();
  const [news, setNews] = useState<NewsData[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showHeader, setShowHeader] = useState(false);

  const fetchBanner = async () => {
    try {
      const response = await bannerApi.getAll();

      const items: Banners[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      const links = items
        .filter((item) => item.status === "active")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => item.imageUrl);

      setBanners(links);
    } catch (error) {
      console.error("Failed to fetch Banners:", error);
      return [];
    }
  };

  const fetchRunway = async () => {
    try {
      const response = await runwayApi.getAll();
      const items: Runway[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const activeItems = items.filter(
        (item) => item.status === "active" && item.isFeatured !== true
      );
      const featureRunway = items.find(
        (item) => item.isFeatured === true && item.status === "active"
      );
      setRunwayFeature(featureRunway);
      setRunway(activeItems);
    } catch (error) {
      console.error("Failed to fetch Runway:", error);
      return [];
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll();
      const items: Product[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];
      const activeItems = items.filter(
        (p) =>
          p.status === "active" &&
          p.categories &&
          p.categories.some((cat) => cat.toLowerCase() === "new")
      );
      setProducts(activeItems);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  const fetchNews = async () => {
    try {
      const response = await newsApi.getAll();
      const items: NewsData[] = Array.isArray(response.data)
        ? response.data
            .filter((item) => item.status === "active")
            .sort(
              (a, b) =>
                new Date(b.createdAt!).getTime() -
                new Date(a.createdAt!).getTime()
            )
            .slice(0, 3)
        : [];

      setNews(items);
    } catch (error) {
      console.error("Failed to fetch News:", error);
      setNews([]);
    }
  };

  useEffect(() => {
    fetchBanner();
    fetchRunway();
    fetchProducts();
    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      {showHeader && <Header />}
      <div className="banner-container">
        <Banner images={banners} />
        <div className="banner-overlay" />
        <div className="d-flex flex-col banner-content width-fullsize justify-between items-center">
          <div className="banner-navigation d-flex flex-row justify-between items-center">
            <div
              className="d-flex flex-row items-center gap-2"
              onClick={() => setOpenContact(true)}
            >
              <img src={ICONS.add} alt="" className="banner-navigation-icon" />
              <Button
                label="Contact Us"
                variant="hover-underline"
                className="banner-navigation-label text-start"
              />
            </div>
            <div className="">
              <TopNavigation
                textColor="#ffffff"
                fontSize="banner-navigation-label"
              />
            </div>
          </div>
          <div
            className={`transition-logo banner-zoom ${
              showHeader ? "logo-scrolled" : ""
            }`}
          >
            <img src={IMAGES.whiteLogo} alt="logo" height={150} width={500} />
          </div>
        </div>
      </div>
      <div className="home-content">
        <div>
          {runwayFeature && <ProductRoll runwayFeature={runwayFeature} />}
        </div>
        <div className="d-flex flex-col items-center width-fullsize">
          <p className="home-fontSize-2xl text-font-semibold text-uppercase p-4">
            The Collection Series
          </p>
          <FeaturedCollections runway={runway} />
        </div>
        <div className="home-divider mt-5" />
        <div className="mt-4">
          <div className="home-view d-flex flex-row justify-between mb-3">
            <span className="font-size-lg text-font-semibold text-uppercase">
              NEW ARRIVALS
            </span>
            <Button
              label={"View All"}
              variant="static-underline"
              className="font-size-base text-font-regular"
              onClick={() => navigate("/shop")}
            />
          </div>
          <Carousel itemProducts={products} />
        </div>
        <div className="mt-5">
          {news.length > 0 && <News listNews={news} />}
        </div>
      </div>
      <div>
        <Footer />
      </div>
      <ContactUs isOpen={openContact} onClose={() => setOpenContact(false)} />
    </>
  );
};

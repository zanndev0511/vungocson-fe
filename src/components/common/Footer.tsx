import React, { useEffect, useState } from "react";
import { IMAGES } from "@constants/image";
import { ICONS } from "@constants/icons";
import "@styles/components/footer.scss";
import { useNavigate } from "react-router-dom";
import type { MenuSideBar } from "@interfaces/components/sideBar";
import menuApi from "@api/services/menuApi";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const [fetchMenu, setFetchMenu] = useState<MenuSideBar[]>([]);

  const fetchMenus = async () => {
    try {
      const response = await menuApi.getAll();
      const items: MenuSideBar[] = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      const activeItems = items
        .filter((item) => item.status === "active")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setFetchMenu(activeItems);
    } catch (error) {
      console.error("Failed to fetch Menus:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);
  return (
    <div className="footer d-flex flex-col justify-center items-center">
      <div className="mb-5 mt-5 fullsize d-flex flex-col justify-center items-center width-fullsize">
        <img
          className="footer-logo mb-5"
          src={IMAGES.whiteLogo}
          alt="logo"
          onClick={() => navigate("/")}
        />
        <div className="footer-content justify-center">
          <div className="d-flex flex-col">
            <p className="footer-text text-font-semibold text-uppercase font-size-md text-start">
              Explore Vungoc&son
            </p>
            <div className="d-flex flex-col items-start mt-2">
              <p
                className="footer-text text-font-light text-capitalize font-size-base"
                onClick={() => navigate("/shop/new-arrivals")}
              >
                New Arrivals
              </p>
              <p className="footer-text text-font-light text-capitalize font-size-base" onClick={()=> navigate('/made-to-order')}>
                Made To Order
              </p>
              {fetchMenu.map((item) => (
                <p
                  className="footer-text text-font-light text-capitalize font-size-base"
                  onClick={() => navigate(`/collection${item.url}`)}
                >
                  {item.title}
                </p>
              ))}
            </div>
          </div>
          <div className="d-flex flex-col">
            <p className="footer-text text-font-semibold text-uppercase font-size-md text-start">
              Online Services
            </p>
            <div className="d-flex flex-col items-start mt-2">
              <p className="footer-text text-font-light text-capitalize font-size-base">
                Contact
              </p>
              <p className="footer-text text-font-light text-capitalize font-size-base">
                FAQ
              </p>
            </div>
          </div>
          <div className="d-flex flex-col">
            <div className="d-flex flex-col">
              <p className="footer-text text-font-semibold text-uppercase font-size-md text-start">
                Contact
              </p>
              <div className="d-flex flex-col items-start mt-2">
                <div className="d-flex flex-row footer-text">
                  <p className="text-font-light text-capitalize font-size-base mr-1">
                    Address:
                  </p>
                  <a
                    href="https://www.google.com/maps?q=85+Le+Thanh+Ton+st.,+Dis1,+HCMC,+Vietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-info-link text-start"
                  >
                    85 Le Thanh Ton St., Dis1, HCMC, Vietnam
                  </a>
                </div>
                <div className="d-flex flex-row footer-text">
                  <p className="text-font-light text-capitalize font-size-base mr-1">
                    Phone:
                  </p>
                  <a href="tel:+84906505070" className="footer-info-link">
                    +84 906 505 070
                  </a>
                </div>
                <div className="d-flex flex-row footer-text">
                  <p className="footer-text text-font-light font-size-base mr-1">
                    Email:
                  </p>
                  <a
                    href="mailto:vungocson.design@gmail.com"
                    className="footer-info-link"
                  >
                    vungocson.design@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <div className="d-flex flex-col mt-5">
              <p className=" d-flex footer-text text-font-semibold text-uppercase font-size-md">
                Follow us
              </p>
              <div className="footer-content-social items-start mt-2">
                <div className="d-flex flex-row footer-text mr-3">
                  <a
                    href="https://www.youtube.com/@vungocson9246"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex flex-row"
                  >
                    <img
                      src={ICONS.youtube}
                      alt=" "
                      height={18}
                      width={18}
                      className="mr-1"
                    />
                    Youtube
                  </a>
                </div>
                <div className="d-flex flex-row footer-text mr-3">
                  <a
                    href="https://www.instagram.com/vungocsonofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex flex-row"
                  >
                    <img
                      src={ICONS.instagram}
                      alt=" "
                      height={18}
                      width={18}
                      className="mr-1"
                    />
                    Instagram
                  </a>
                </div>
                <div className="d-flex flex-row footer-text mr-3">
                  <a
                    href="https://www.facebook.com/vungocsonvietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex flex-row"
                  >
                    <img
                      src={ICONS.facebook}
                      alt=" "
                      height={18}
                      width={18}
                      className="mr-1"
                    />
                    Facebook
                  </a>
                </div>
                <div className="d-flex flex-row footer-text mr-3">
                  <a
                    href="https://www.youtube.com/@vungocson9246"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex flex-row"
                  >
                    <img
                      src={ICONS.wechat}
                      alt=" "
                      height={18}
                      width={18}
                      className="mr-1"
                    />
                    Wechat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="footer-text text-font-light mt-5">
          Copyright © 2025. All Rights Reseved.
        </p>
      </div>
    </div>
  );
};
export default Footer;

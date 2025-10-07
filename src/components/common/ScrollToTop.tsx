import type { ScrollToTopProps } from "@interfaces/components/scrollToTop";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC<ScrollToTopProps> = (props) => {
  const { children } = props;
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;

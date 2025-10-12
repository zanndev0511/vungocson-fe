import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@api/index";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }: { children: React.ReactNode;
 }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosClient.get("/auth/me", {
          headers: { "Cache-Control": "no-cache" },
        });
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
        console.error(err)
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !authenticated) {
      toast.error("Your session has expired. Please log in again.", {
        className: "text-font-regular font-size-sm",
        autoClose: 5000,
        position: "top-center",
      });

      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loading, authenticated, navigate]);

  if (loading) return <div className="text-font-regular font-size-sm"></div>;

  if (!authenticated) return null;

  return children;
};

export default ProtectedRoute;
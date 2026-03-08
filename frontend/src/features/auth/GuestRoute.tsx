import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../service/user.service";

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * GuestRoute — wraps Login/Register pages.
 * If the user is already authenticated, they are redirected to `redirectTo` (default: "/dashboard").
 */
export default function GuestRoute({ children, redirectTo = "/dashboard" }: GuestRouteProps) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        if (res.data?.user) {
          navigate(redirectTo, { replace: true });
        }
      } catch {
        // Not logged in — allow access to the guest page
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate, redirectTo]);

  if (checking) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "14px",
        color: "#888"
      }}>
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
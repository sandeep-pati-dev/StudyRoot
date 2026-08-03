import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page since we handle both login and signup there
    navigate("/login");
  }, [navigate]);

  return <Login />;
};

export default Signup;
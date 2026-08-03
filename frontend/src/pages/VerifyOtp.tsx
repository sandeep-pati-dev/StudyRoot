import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "@/lib/axiosInstance";

const VerifyOtp = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/auth/verify-otp", {
  email: state.email,
  otp: otp
});

      console.log("OTP Verified ✅", data);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("OTP Error ❌", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
};

export default VerifyOtp;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import LoginLeftSide from "../assets/login-left.png";
import Logo from "../assets/logo.png.png";
import api from "../services/api";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [userNameErr, setUserNameErr] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const hasMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    console.log("user in login page", user);
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username && !password) {
      setUserNameErr(true);
      setPassErr(true);
      return;
    }
    if (!username) {
      setUserNameErr(true);
      return;
    }
    if (!password) {
      setPassErr(true);
      return;
    }

    setLoading(true);
    try {
      const result = await api.login({ username, password });
      if (!result.error) {
        login({ username, role: "main admin" });
        navigate("/students/all");
        toast.success("Login successful! 🎉", { position: "top-center" });
      } else {
        toast.error("Login Failed!", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Login Failed!", { position: "top-center" });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  const [isTouched, setIsTouched] = useState({
    username: false,
    password: false,
  });

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return; // Skip execution on initial render
    }

    if (isTouched.username) {
      setUserNameErr(username.trim() === "");
    }
    if (isTouched.password) {
      setPassErr(password.trim() === "");
    }
  }, [username, password, isTouched]);

  return (
    <>
      {loading && <Spinner />}
      <div className="flex min-h-screen bg-gray-50">
        {/* Logo */}
        <div className="hidden lg:block absolute left-4 z-10">
          <img src={Logo} alt="Ivanios Logo" className="h-36 w-auto" />
        </div>

        {/* Left side with image - hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 lg:w-2/3 items-center justify-center">
          <img
            src={LoginLeftSide}
            alt="Login Illustration"
            className="max-w-md lg:max-w-2xl w-full h-auto object-contain p-6"
          />
        </div>

        {/* Right side with login form */}
        <div className="w-full md:w-1/2 lg:w-1/3 flex items-center justify-center p-4 md:p-8">
          <Card className="w-full max-w-md shadow-lg rounded-lg bg-white">
            <CardContent className="p-6 md:p-8">
              {/* Show logo on mobile only */}
              <div className="flex justify-center md:hidden">
                <img src={Logo} alt="Ivanios Logo" className="h-32 w-auto" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800">
                Welcome to IVANIOS
              </h2>
              <p className="text-sm text-center text-gray-500 mb-6 md:mb-8 px-4">
                "Behind every great institution is a visionary leader—welcome back, Admin!"
              </p>

              {/* Role Selection Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <Button
                  className={`py-2 px-3 rounded text-sm md:text-base ${
                    role === "Admin"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setRole("Admin")}
                >
                  Admin
                </Button>
                <div className="relative">
                  <Button
                    className="w-full py-2 px-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed text-sm md:text-base"
                    disabled
                  >
                    Teacher
                  </Button>
                  <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start overflow-hidden">
                    <div className="w-full bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-1 py-0.5 shadow-md transform -rotate-42 translate-x-[-35%] translate-y-[3px] text-center">
                      Next-Up
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Button
                    className="w-full py-2 px-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed text-sm md:text-base"
                    disabled
                  >
                    Student
                  </Button>
                  <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start overflow-hidden">
                    <div className="w-full bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-1 py-0.5 shadow-md transform -rotate-42 translate-x-[-35%] text-center">
                      Next-Up
                    </div>
                  </div>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <Input
                    className={`border ${
                      userNameErr ? "border-red-700" : "border-gray-300"
                    } p-3 rounded w-full text-base`}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() =>
                      setIsTouched((prev) => ({ ...prev, username: true }))
                    }
                  />
                  {userNameErr && (
                    <p className="text-red-700 text-sm mt-1">
                      Please enter username
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    className={`border ${
                      passErr ? "border-red-700" : "border-gray-300"
                    } p-3 rounded w-full text-base`}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() =>
                      setIsTouched((prev) => ({ ...prev, password: true }))
                    }
                  />
                  {passErr && (
                    <p className="text-red-700 text-sm mt-1">
                      Please enter Password
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg text-base md:text-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Login
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

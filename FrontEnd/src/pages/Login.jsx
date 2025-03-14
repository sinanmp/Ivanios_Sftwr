import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import LoginLeftSide from "../assets/login-left.png";
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
  const { login } = useAuth();
  const navigate = useNavigate();

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
        login({ role: "main admin" });
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


  useEffect(()=>{
    const user = localStorage.getItem("user")
    console.log("this is inside useEffect")
    if(user){
      navigate("/students/all")
    }
  },[])

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
      <div className="flex h-screen justify-center items-center">
        <div className="w-1/2 flex">
          <img
            src={LoginLeftSide}
            alt="Login Illustration"
            className="max-w-sm -ml-10 md:ml-12 lg:max-w-2xl "
          />
        </div>
        <div className="w-1/3 lg:w-1/2 flex items-center justify-center">
          <Card className="max-w-sm shadow-lg rounded-lg bg-white relative">
            <CardContent>
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                Welcome to IVANIOS
              </h2>
              <p className="text-sm text-center text-gray-500 mb-8">
                "Behind every great institution is a visionary leader—welcome
                back, Admin!"
              </p>
              <div className="flex justify-between mb-6 relative gap-2.5">
                <Button
                  className={`w-full py-2 mx-1 rounded ${
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
                    className="w-full py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed relative"
                    disabled
                  >
                    Teacher
                  </Button>
                  <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start overflow-hidden cursor-not-allowed">
                    <div className="w-full bg-red-500 text-white text-[8px] font-bold px-2 py-1 shadow-md transform -rotate-42 translate-x-[-35%] translate-y-[3px] text-center">
                      Next-Up
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Button
                    className="w-full py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed relative"
                    disabled
                  >
                    Student
                  </Button>
                  <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start overflow-hidden cursor-not-allowed">
                    <div className="w-full bg-red-500 text-white text-[8px] font-bold px-2 py-1 shadow-md transform -rotate-42 translate-x-[-35%] text-center">
                      Next-Up
                    </div>
                  </div>
                </div>
              </div>
              <form onSubmit={onSubmit}>
                <div className="space-y-4">
                  <div>
                    <Input
                      className={`border ${
                        userNameErr ? "border-red-700" : "border-gray-300"
                      } p-3 rounded w-full`}
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={() =>
                        setIsTouched((prev) => ({ ...prev, username: true }))
                      }
                    />
                    {userNameErr && (
                      <p className="text-red-700 text-sm">
                        Please enter username
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      className={`border ${
                        passErr ? "border-red-700" : "border-gray-300"
                      } p-3 rounded w-full`}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() =>
                        setIsTouched((prev) => ({ ...prev, password: true }))
                      }
                    />
                    {passErr && (
                      <p className="text-red-700 text-sm">
                        Please enter Password
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
                  >
                    Login
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card, CardContent } from "./ui/Card";
import LoginLeftSide from "../assets/login-left.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  return (
    <div className="flex h-screen justify-center items-center">
      {/* Left Side - Image */}
      <div className="w-1/2 flex items-center justify-center">
        <img
          src={LoginLeftSide}
          alt="Login Illustration"
          className="w-auto h-auto"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-[400px] p-8 shadow-lg rounded-lg bg-white relative">
          <CardContent>
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Welcome to IVANIOS
            </h2>
            <p className="text-sm text-center text-gray-500 mb-8">
              "Behind every great institution is a visionary leader—welcome
              back, Admin!"
            </p>

            {/* Role Selection */}
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

              {/* Disabled Teacher Button with "Upcoming" Banner */}
              <div className="relative ">
                <Button
                  className="w-full py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed relative"
                  disabled
                >
                  Teacher
                </Button>
                <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start overflow-hidden cursor-not-allowed">
                  <div className="w-full bg-red-500 text-white text-[8px] font-bold px-2 py-1 shadow-md transform -rotate-42 translate-x-[-35%] translate-y-[3px]">
                    Next-Up
                  </div>
                </div>
              </div>

              {/* Disabled Student Button with "Upcoming" Banner */}
              <div className="relative">
                <Button
                  className="w-full py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed relative "
                  disabled
                >
                  Student
                </Button>
                <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start overflow-hidden cursor-not-allowed">
                  <div className="w-full bg-red-500 text-white text-[8px] font-bold px-2 py-1 shadow-md transform -rotate-42 translate-x-[-35%] translate-y-[3px]">
                    Next-Up
                  </div>
                </div>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <Input
                className="border p-3 rounded w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                className="border p-3 rounded w-full"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex justify-between text-sm text-gray-600">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-1" /> Remember me
                </label>
                <a href="#" className="text-blue-500">
                  Forgot Password?
                </a>
              </div>

              <Button className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg">
                Login
              </Button>
            </div>

            {/* OR Separator with Lines */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Media Login */}
            <div className="flex justify-center gap-4">
              <FaGoogle className="text-2xl cursor-pointer text-red-500" />
              <FaFacebook className="text-2xl cursor-pointer text-blue-600" />
              <FaTwitter className="text-2xl cursor-pointer text-sky-400" />
              <FaLinkedin className="text-2xl cursor-pointer text-blue-700" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

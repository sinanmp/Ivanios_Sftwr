import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 flex items-center justify-center p-10">
        <img src="/mnt/data/image.png" alt="Login Illustration" className="w-full h-auto" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-96 p-6 shadow-xl">
          <CardContent>
            <h2 className="text-2xl font-bold text-center mb-4">Welcome to Smart</h2>
            <p className="text-sm text-center text-gray-500">Need an account? <a href="#" className="text-blue-500">Sign Up</a></p>
            <div className="flex justify-center gap-2 my-4">
              <Button className={`px-4 py-2 rounded ${role === "Admin" ? "bg-green-600 text-white" : "bg-gray-200"}`} onClick={() => setRole("Admin")}>Admin</Button>
              <Button className={`px-4 py-2 rounded ${role === "Teacher" ? "bg-orange-500 text-white" : "bg-gray-200"}`} onClick={() => setRole("Teacher")}>Teacher</Button>
              <Button className={`px-4 py-2 rounded ${role === "Student" ? "bg-blue-600 text-white" : "bg-gray-200"}`} onClick={() => setRole("Student")}>Student</Button>
            </div>
            <div className="space-y-4">
              <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border rounded px-3 py-2 w-full" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2 w-full" />
              <div className="flex justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="mr-1" /> Remember me
                </label>
                <a href="#" className="text-blue-500">Forgot Password?</a>
              </div>
              <Button className="w-full bg-blue-600 text-white py-2 rounded">Login</Button>
            </div>
            <div className="text-center mt-4 text-gray-500 text-sm">OR</div>
            <div className="flex justify-center gap-4 mt-4">
              <FaGoogle className="text-xl cursor-pointer" />
              <FaFacebook className="text-xl cursor-pointer" />
              <FaTwitter className="text-xl cursor-pointer" />
              <FaLinkedin className="text-xl cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

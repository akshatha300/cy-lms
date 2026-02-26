import axios from "axios";

const testLogin = async () => {
  try {
    console.log("🧪 Testing login API...");
    
    const response = await axios.post("http://localhost:5001/api/auth/login", {
      email: "admin@cy-lms.com",
      password: "admin123"
    });
    
    console.log("✅ Login successful!");
    console.log("Response:", response.data);
    console.log("User role:", response.data.user?.role);
    
  } catch (error) {
    console.error("❌ Login failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.response?.data?.message);
  }
};

testLogin();

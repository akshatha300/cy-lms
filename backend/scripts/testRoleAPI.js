import fetch from "node-fetch";

const testRoleAPI = async () => {
  try {
    console.log("🧪 Testing Role API...");
    
    // First login to get token
    const loginResponse = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: "admin@cy-lms.com",
        password: "admin123"
      })
    });
    
    if (!loginResponse.ok) {
      console.log(`❌ Login failed: ${loginResponse.status}`);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log("✅ Login successful");
    
    // Test role endpoint
    const roleResponse = await fetch("http://localhost:5001/api/roles/me/role", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    console.log(`Role API Status: ${roleResponse.status}`);
    
    if (roleResponse.ok) {
      const roleData = await roleResponse.json();
      console.log("✅ Role API Response:");
      console.log(JSON.stringify(roleData, null, 2));
    } else {
      console.log(`❌ Role API failed: ${await roleResponse.text()}`);
    }
    
  } catch (error) {
    console.error("❌ Error testing role API:", error.message);
  }
};

testRoleAPI();

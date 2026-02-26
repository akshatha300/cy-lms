import fetch from "node-fetch";

const testFrontendFlow = async () => {
  try {
    console.log("🧪 Testing Complete Frontend Flow...");
    
    // Step 1: Login
    const loginResponse = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    console.log("✅ Step 1: Login successful");
    
    // Step 2: Get user role (what frontend does first)
    const roleResponse = await fetch("http://localhost:5001/api/roles/me/role", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!roleResponse.ok) {
      console.log(`❌ Role API failed: ${roleResponse.status}`);
      return;
    }
    
    const roleData = await roleResponse.json();
    console.log("✅ Step 2: Role API successful");
    console.log(`Primary role: ${roleData.primaryRole}`);
    console.log(`Role filtered: ${roleData.roleFiltered}`);
    
    // Step 3: Get modules (what frontend does when no role)
    const modulesResponse = await fetch("http://localhost:5001/api/modules", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!modulesResponse.ok) {
      console.log(`❌ Modules API failed: ${modulesResponse.status}`);
      console.log(`Response: ${await modulesResponse.text()}`);
      return;
    }
    
    const modulesData = await modulesResponse.json();
    console.log("✅ Step 3: Modules API successful");
    console.log(`Modules count: ${modulesData.length || modulesData.modules?.length || 0}`);
    
    // Show first module for verification
    const modules = modulesData.modules || modulesData;
    if (modules && modules.length > 0) {
      console.log(`First module: ${modules[0].title}`);
      console.log(`Description: ${modules[0].description?.substring(0, 100)}...`);
    }
    
    console.log("🎉 Frontend flow test completed successfully!");
    
  } catch (error) {
    console.error("❌ Error in frontend flow test:", error.message);
  }
};

testFrontendFlow();

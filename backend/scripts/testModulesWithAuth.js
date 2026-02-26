import fetch from "node-fetch";

const testModulesWithAuth = async () => {
  try {
    console.log("🧪 Testing Modules API with Authentication...");
    
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
      console.log(`Response: ${await loginResponse.text()}`);
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log("✅ Login successful, got token");
    
    // Now get modules with token
    const modulesResponse = await fetch("http://localhost:5001/api/modules", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    if (!modulesResponse.ok) {
      console.log(`❌ Modules API failed: ${modulesResponse.status}`);
      console.log(`Response: ${await modulesResponse.text()}`);
      return;
    }
    
    const modulesData = await modulesResponse.json();
    console.log("✅ Modules API Response:");
    console.log("Full response:", JSON.stringify(modulesData, null, 2));
    
    const modules = modulesData.modules || modulesData; // Handle both response formats
    console.log(`Found ${modules?.length || 0} modules`);
    
    if (modules && modules.length > 0) {
      modules.forEach((module, index) => {
        console.log(`${index + 1}. ${module.title}`);
        console.log(`   Description: ${module.description?.substring(0, 80)}...`);
        console.log(`   Difficulty: ${module.difficulty}`);
        console.log(`   Tags: ${module.tags?.join(", ") || "None"}`);
        console.log("");
      });
    } else {
      console.log("❌ No modules found in API response");
    }
    
  } catch (error) {
    console.error("❌ Error testing modules API:", error.message);
  }
};

testModulesWithAuth();

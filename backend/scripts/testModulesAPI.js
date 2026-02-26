import fetch from "node-fetch";

const testModulesAPI = async () => {
  try {
    console.log("🧪 Testing Modules API...");
    
    // Test without authentication first
    const response = await fetch("http://localhost:5001/api/modules");
    
    if (!response.ok) {
      console.log(`❌ API Status: ${response.status}`);
      console.log(`Response: ${await response.text()}`);
      return;
    }
    
    const data = await response.json();
    console.log("✅ Modules API Response:");
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error("❌ Error testing modules API:", error.message);
  }
};

testModulesAPI();

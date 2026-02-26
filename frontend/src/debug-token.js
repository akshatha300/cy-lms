// Debug authentication token
console.log("=== TOKEN DEBUG INFO ===");
console.log("Token exists:", !!localStorage.getItem("token"));
console.log("Token length:", localStorage.getItem("token")?.length);
console.log("Token starts with Bearer:", localStorage.getItem("token")?.startsWith("eyJ"));

if (localStorage.getItem("token")) {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Token payload:", payload);
    console.log("Token expires:", new Date(payload.exp * 1000));
    console.log("Token expired:", Date.now() > payload.exp * 1000);
  } catch (e) {
    console.error("Error parsing token:", e);
  }
}

console.log("User data:", localStorage.getItem("user"));
console.log("========================");

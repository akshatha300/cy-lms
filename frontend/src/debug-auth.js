// Debug authentication state
console.log("=== AUTH DEBUG INFO ===");
console.log("Token:", localStorage.getItem("token"));
console.log("User data:", localStorage.getItem("user"));

if (localStorage.getItem("user")) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Parsed user:", user);
    console.log("User role:", user?.role);
    console.log("User name:", user?.name);
    console.log("User email:", user?.email);
  } catch (e) {
    console.error("Error parsing user data:", e);
  }
}
console.log("========================");

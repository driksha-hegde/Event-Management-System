const jwt = require("jsonwebtoken");

// Replace with your actual token and secret key
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTRmMTkzNjVmZGMxNDM0N2ZhMmZmMyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MzA2NjU5MSwiZXhwIjoxNzQzMDcwMTkxfQ.RG-8C9OirQMgoazkz4x4SKboJCaS-gUpTaQ8nLMMQ2U";
const secret = "d20a934b6c15e2eb38747336ed7b2c2ba9c0e1620ef8a777f91998e120a751f6"; // Make sure this matches the secret used in authController.js

try {
    const decoded = jwt.verify(token, secret);
    console.log("✅ Decoded Token:", decoded);
} catch (error) {
    console.error("❌ Token verification failed:", error.message);
}

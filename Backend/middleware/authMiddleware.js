const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        console.log("🛠 Authorization Header:", authHeader); // Debugging

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("❌ No token provided");
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // Extract token
        console.log("🔑 Extracted Token:", token); // Debugging

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Decoded Token:", decoded); // Debugging

            // Check if role-based authentication is needed
            if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
                console.log("❌ Forbidden: User role not authorized:", decoded.role);
                return res.status(403).json({ message: "Forbidden: You do not have access" });
            }

            req.user = decoded; // Attach decoded user to `req`
            next();
        } catch (error) {
            console.error("❌ JWT Verification Error:", error.message);
            return res.status(401).json({ message: "Invalid token", error: error.message });
        }
    };
};

module.exports = authMiddleware;




import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received in middleware:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded token:", decoded.userId);

        req.user = decoded.userId

        // console.log("User authenticated:", req.user);

        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default authMiddleware;

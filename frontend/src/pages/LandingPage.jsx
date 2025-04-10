import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/landing-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "fixed", 
        top: 0,
        left: 0,
        zIndex: 9999, 
      }}
    >
      {/* Dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      ></div>

      {/* Floating-in effect for text & button */}
      <motion.div
        style={{ position: "relative", zIndex: 1, color: "white" }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
          Effortless Planning, Extraordinary Events.
        </h1>
        <Link to="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "#F7931E",
              color: "white",
              border: "none",
              padding: "15px 30px",
              fontSize: "1.2rem",
              cursor: "pointer",
              borderRadius: "5px",
              marginTop: "20px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            Get Started
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default LandingPage;

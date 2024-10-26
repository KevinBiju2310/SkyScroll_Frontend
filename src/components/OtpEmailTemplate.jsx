const OtpEmailTemplate = ({ otp, userName }) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1 style={{ color: "#333333", textAlign: "center" }}>Your OTP Code</h1>
        <p style={{ fontSize: "16px", color: "#666666", lineHeight: 1.5 }}>
          Hi {userName || "there"},
        </p>
        <p style={{ fontSize: "16px", color: "#666666", lineHeight: 1.5 }}>
          Thank you for signing up! Please use the one-time password (OTP) below
          to verify your email address. This OTP is valid for the next 5
          minutes.
        </p>
        <div
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1a73e8",
            textAlign: "center",
            margin: "20px 0",
          }}
        >
          {otp}
        </div>
        <p style={{ fontSize: "16px", color: "#666666", lineHeight: 1.5 }}>
          If you didn’t request this, please ignore this email.
        </p>
        <div style={{ textAlign: "center" }}>
          <a
            href="#"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "#1a73e8",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "5px",
            }}
          >
            Verify Now
          </a>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "12px",
            color: "#999999",
          }}
        >
          <p>If you have any issues, feel free to contact our support team.</p>
          <p>&copy; 2024 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default OtpEmailTemplate;

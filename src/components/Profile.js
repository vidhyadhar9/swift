import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users/2")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Top Bar */}
      <div style={{
        backgroundColor: "#1E1F4B",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ fontSize: "20px", margin: 0 }}>
          Welcome, {user.name}
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link to="/dashboard" style={{ color: "white", textDecoration: "none", marginRight: "10px" }}>
            &larr; DashBoard
          </Link>
          <div style={{
            backgroundColor: "#ccc",
            color: "#000",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold"
          }}>
            {initials}
          </div>
          <span>{user.name}</span>
        </div>
        
      </div>

      {/* Profile Card */}
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "30px",
          width: "700px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "20px",
            marginBottom: "20px"
          }}>
            <div style={{
              backgroundColor: "#ccc",
              color: "#000",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ margin: "0 0 5px 0" }}>{user.name}</h2>
              <p style={{ margin: 0, color: "#666" }}>{user.email}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "#888" }}>User ID</label>
              <input type="text" value="12345687" readOnly
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888" }}>Name</label>
              <input type="text" value={user.name} readOnly
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888" }}>Email ID</label>
              <input type="text" value={user.email} readOnly
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888" }}>Address</label>
              <input type="text"
                value={`${user.address.street} ${user.address.suite} ${user.address.city}`}
                readOnly
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888" }}>Phone</label>
              <input type="text" value={user.phone} readOnly
                style={inputStyle} />
            </div>
          </div>
   
        </div>
      </div>
      
    </div>
  );
}

// Common input style
const inputStyle = {
  width: "100%",
  backgroundColor: "#f5f5f5",
  padding: "8px",
  border: "none",
  borderRadius: "4px",
  fontSize: "14px"
};

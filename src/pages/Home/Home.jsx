import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Home 화면</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        <Link to="/menti">
          <button>멘티 화면</button>
        </Link>
        <Link to="/mento">
          <button>멘토 화면</button>
        </Link>
      </div>
    </div>
  );
}

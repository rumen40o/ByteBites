import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/api";
import "../css/profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (err) {
        setError("Не сте логнати или сесията е изтекла.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getRoleIcon = () => {
    if (!user) return "";
    switch (user.role) {
      case "USER":
        return "👤";
      case "DELIVER":
        return "🚚";
      case "OWNER":
        return "👨‍💼";
      default:
        return "❓";
    }
  };

  if (loading)
    return <div className="text-center mt-10">Зареждане на профила...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile Information</h1>
      <button className="edit-btn">✏️ Edit</button>

      <div className="profile-content">
        <div className="profile-icon">{getRoleIcon()}</div>

        <div className="profile-data">
          <p>
            <strong>USERNAME:</strong> <span>{user.username}</span>
          </p>
          <p>
            <strong>EMAIL:</strong> <span>{user.email}</span>
          </p>
          <p>
            <strong>PHONE NUMBER:</strong> <span>{user.phoneNumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

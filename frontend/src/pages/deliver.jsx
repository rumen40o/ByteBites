import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliverPage = ({ onLogout }) => {
    const navigate = useNavigate();


    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            navigate("/"); // ✅ Пренасочваме обратно към HomePage
            window.location.reload(); // ✅ Презареждаме, за да нулираме сесията
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold">Deliver Page</h1>
            <button
                className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default DeliverPage;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";

import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showDeliverRegister, setShowDeliverRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/auth/me", { withCredentials: true })
        .then((res) => { // ✅ Преименуваме на `res`, за да няма конфликти
            setUser(res.data);
            if (res.data.role === "DELIVER") { // ✅ Сега имаме достъп до `res.data`
                navigate("/deliver");
            }
        })
        .catch(() => setUser(null));
}, [navigate]);


const handleLogout = async () => {
  try {
      await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
      setUser(null); // Премахваме потребителя от state
      setMenuOpen(false); // Скриваме менюто
      window.location.reload();
  } catch (err) {
      console.error("Logout failed:", err);
  }
};


  return (
   <div>
    <div>
                {/* Ако потребителят е логнат, показваме иконка и падащо меню */}
                {user ? (
                    <div className="relative">
                        <button 
                            className="text-5xl text-gray-700 hover:text-gray-900 transition"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FaUserCircle />
                        </button>

                        {/* Ако е админ, добавяме бутон "Add Restaurant" */}
                        {user.role === "ADMIN" && (
                            <button 
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                onClick={() => navigate("/add-restaurant")}
                            >
                                Add Restaurant
                            </button>
                        )}

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
                                <button 
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={() => navigate("/profile")}
                                >
                                    Виж профил
                                </button>
                                <button 
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Бутон за Вход */}
                        <button 
                            onClick={() => setShowLogin(true)}
                        >
                            Login
                        </button>

                        {/* Бутон за регистрация на доставчик */}
                        <button 
                            onClick={() => setShowDeliverRegister(true)}
                        >
                            Стани Доставчик
                        </button>
                    </>
                )}
            </div>
        {showLogin && (
                <LoginModal 
                    close={() => setShowLogin(false)} 
                    openRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                    onLoginSuccess={() => window.location.reload()}
                />
            )}
      {showRegister && <RegisterModal close={() => setShowRegister(false)} role="USER"/>}

      {showDeliverRegister && <RegisterModal close={() => setShowDeliverRegister(false)} role="DELIVER" />}
   </div>
  );
}

export default Home;
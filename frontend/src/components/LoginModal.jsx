import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginModal = ({ close, openRegister, onLoginSuccess }) => {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();


    const validateForm = () => {
        const newErrors = {};
        
        if (!identifier.trim()) {
            newErrors.identifier = "Моля, въведете имейл или потребителско име!";
        }
        if (!password.trim()) {
            newErrors.password = "Моля, въведете парола!";
        }
    
        setError(newErrors); // Запазваме новите грешки
    
        return Object.keys(newErrors).length === 0; // Връщаме `true`, ако няма грешки
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setServerError(null);
    
        if (!validateForm()) {
            return;
        }
    
        try {
            const response = await axios.post(
                "http://localhost:8080/auth/login",
                { identifier, password },
                { withCredentials: true }
            );
    
            console.log("Login successful:", response.data);
    
            // ✅ Успешен логин -> Редирект към началната страница
            onLoginSuccess();
            close(); // Затваряме pop-up-а
        } catch (err) {
            console.error("❌ Axios Error:", err);
        
            if (err.response) {
                console.log("📌 Server Response:", err.response);
                
                // Проверяваме дали `err.response.data` е текст или JSON
                if (typeof err.response.data === "string") {
                    setServerError(err.response.data);
                } else if (err.response.data?.message) {
                    setServerError(err.response.data.message);
                } else {
                    setServerError("Грешка при вход!");
                }
            } else if (err.request) {
                console.log("📌 Request made, но няма отговор:", err.request);
                setServerError("Сървърът не отговаря!");
            } else {
                console.log("📌 Грешка в заявката:", err.message);
                setServerError("Непозната грешка: " + err.message);
            }
        }
    };

    return (
        <div>
            <div>
                <button 
                    onClick={close}
                >
                    ✖
                </button>
                <h2>Вход</h2>
                <form onSubmit={handleLogin}>
                    <div>
                    <input
                        type="text"
                        placeholder="Имейл или Потребителско име"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                        {error.identifier && <p className="text-red-500 text-xs mt-1">{error.identifier}</p>}
                    </div>

                    <div>
                    <input
                        type="password"
                        placeholder="Парола"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                    </div>
                    
                    <button
                        type="submit"
                    >
                        Вход
                    </button>
                </form>
                <p>
                    Нямате акаунт?{" "}
                    <button 
                        onClick={openRegister}
                    >
                        Регистрирайте се
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
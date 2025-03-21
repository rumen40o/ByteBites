import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/LoginModal.css"

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
    
        setError(newErrors);
    
        return Object.keys(newErrors).length === 0;
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
    

            const loggedUser = response.data;
    
            if (loggedUser.role === "DELIVER") {
                navigate("/deliver");
            } else {
                navigate("/");
            }

            onLoginSuccess();
            close(); 
        } catch (err) {
            console.error("Axios Error:", err);
        
            if (err.response) {
                console.log("Server Response:", err.response);
                
                if (typeof err.response.data === "string") {
                    setServerError(err.response.data);
                } else if (err.response.data?.message) {
                    setServerError(err.response.data.message);
                } else {
                    setServerError("Грешка при вход!");
                }
            } else if (err.request) {
                console.log("Request made, но няма отговор:", err.request);
                setServerError("Сървърът не отговаря!");
            } else {
                console.log("Грешка в заявката:", err.message);
                setServerError("Непозната грешка: " + err.message);
            }
        }
    };

    return (
        <div class="overlay">
            <div class="login-container">
                <button 
                    onClick={close}
                    className="close_button"
                >
                    ✖
                </button>
                <div class="login-content">
                <div class="form-section">
                <h2 className="text">Вход</h2>
                <form onSubmit={handleLogin} className="form">
                    <input
                        type="text"
                        placeholder="Имейл или Потребителско име"
                        value={identifier}
                        className="inputs"
                        onChange={(e) => setIdentifier(e.target.value)}
                    />
                        {error.identifier && <p className="text-red-500 text-xs mt-1">{error.identifier}</p>}
                    <input
                        type="password"
                        placeholder="Парола"
                        value={password}
                        className="inputs"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
                    
                    <button
                        type="submit"
                        class="login-btn"
                    >
                        Вход
                    </button>
                </form>
                <p>
                    Нямате акаунт?{" "}
                    <button 
                        onClick={openRegister}
                        className="register_button"
                    >
                        Регистрирайте се
                    </button>
                </p>
                </div>
                <div class="image-section">
                    <img src="sushi.png" alt="Sushi Image"/>
                </div>
            </div>
        </div>
    </div>
                
    );
};

export default LoginModal;
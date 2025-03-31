import { useState } from "react";
import axios from "axios";
import "../css/RegisterModal.css";

const RegisterModal = ({ close, role }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(null);

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^(\+359|0)[8-9][0-9]{8}$/;
        return phoneRegex.test(number);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validatePhoneNumber(phoneNumber)) {
            setError("Невалиден телефонен номер! Използвайте формат: +359XXXXXXXXX или 0XXXXXXXXX");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                username,
                email,
                password,
                phone_number: phoneNumber,
                role 
            });

            console.log("Registration successful:", response.data);
            close();
        } catch (err) {
            setError(err.response?.data || "Грешка при регистрация!");
        }
    };

    return (
        <div className="overlay">
            <div className="register-container">
                <button 
                    onClick={close}
                    className="close_button"
                >
                    ✖
                </button>
                <div className="register-content">
                    <div className="form-section">
                        <h2 className="text">
                        {role === "DELIVER" ? "Стани Доставчик"
                            : role === "OWNER"
                            ? "Стани Собственик"
                            : "Регистрация"}
                        </h2>
                        <form onSubmit={handleRegister} className="form">
                            <input
                                type="text"
                                placeholder="Потребителско име"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="inputs"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Имейл"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="inputs"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Парола"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="inputs"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="+359888123456 или 0888123456"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="inputs"
                                required
                            />
                            {error && <p className="error-message">{error}</p>}
                            <button
                                type="submit"
                                className="register-btn"
                            >
                                {role === "DELIVER" ? "Стани Доставчик"
                                : role === "OWNER"
                                ? "Стани Собственик"
                                : "Регисрирай се"}
                            </button>
                        </form>
                    </div>
                    <div className="image-section">
                        <img src="sushi.png" alt="Sushi Image"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;

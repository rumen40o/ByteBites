import { useState } from "react";
import axios from "axios";

const RegisterModal = ({ close, role }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState(null);

    // Функция за валидация на телефонен номер
    const validatePhoneNumber = (number) => {
        const phoneRegex = /^(\+359|0)[8-9][0-9]{8}$/;
        return phoneRegex.test(number);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        // Проверка дали телефонният номер е валиден
        if (!validatePhoneNumber(phoneNumber)) {
            setError("Невалиден телефонен номер! Използвайте формат: +359XXXXXXXXX или 0XXXXXXXXX");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                username,
                email,
                password,
                phone_number: phoneNumber,  // Изпращаме коректно phoneNumber
                role 
            });

            console.log("Registration successful:", response.data);
            close();
        } catch (err) {
            setError(err.response?.data || "Грешка при регистрация!");
        }
    };

    return (
        <div>
            <div>
                <button onClick={close}>✖</button>
                <h2 className="text-xl font-bold mb-4">
                    {role === "DELIVER" ? "Стани Доставчик" : "Регистрация"}
                </h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Потребителско име"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Имейл"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Парола"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        placeholder="+359888123456 или 0888123456"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`border p-2 ${error ? "border-red-500" : "border-gray-300"}`}
                        required
                    />
                    <button type="submit">
                        {role === "DELIVER" ? "Стани Доставчик" : "Регистрирай се"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;

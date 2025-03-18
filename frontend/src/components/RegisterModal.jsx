import { useState } from "react";
import axios from "axios";

const RegisterModal = ({ close, role }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                username,
                email,
                password,
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
                <button 
                    onClick={close}
                >
                    ✖
                </button>
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
                    />
                    <input
                        type="email"
                        placeholder="Имейл"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Парола"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                    >
                        {role === "DELIVER" ? "Стани Доставчик" : "Регистрирай се"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;

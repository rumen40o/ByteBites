import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/auth/me", { withCredentials: true })
            .then((response) => setUser(response.data))
            .catch(() => setError("Не сте логнати или сесията е изтекла."));
    }, []);

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (!user) {
        return <div className="text-center mt-10">Зареждане...</div>;
    }

    return (
        <div>
            <h1>Профил</h1>
            <div>
                <p><strong>Потребителско име:</strong> {user.username}</p>
                <p><strong>Имейл:</strong> {user.email}</p>
                <p><strong>Роля:</strong> {user.role}</p>
            </div>
        </div>
    );
};

export default ProfilePage;
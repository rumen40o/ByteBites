import { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userResponse = await axios.get("http://localhost:8080/auth/logged/user", { withCredentials: true });
                setUser(userResponse.data);
            } catch (error) {
                setError("Не сте логнати или сесията е изтекла.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Зареждане...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (!user) {
        return <div className="text-center mt-10">Моля, влезте в профила си.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">Профил</h1>
                <div className="space-y-2">
                    <p><strong>Потребителско име:</strong> {user.username}</p>
                    <p><strong>Имейл:</strong> {user.email}</p>
                    <p><strong>Телефон:</strong> {user.phoneNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
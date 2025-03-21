import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const DeliverPage = () => {
    const navigate = useNavigate();
    const [availableOrders, setAvailableOrders] = useState([]); // Поръчки за приемане
    const [deliveries, setDeliveries] = useState([]); // Текущи доставки
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deliverId, setDeliverId] = useState(null); // Държим `deliverId` в state

    useEffect(() => {
        getCurrentUser(); // ✅ Извличаме текущия потребител
    }, []);

    // ✅ Взимаме информация за текущия потребител (доставчик)
    const getCurrentUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/auth/me", { withCredentials: true });
            console.log("📌 Вход потребител:", response.data);
            setDeliverId(response.data.id); // ✅ Запазваме `deliverId`
            loadAvailableOrders(); // ✅ Зареждаме поръчките
            loadDeliveries(response.data.id);
        } catch (error) {
            console.error("❌ Грешка при вземане на текущия потребител:", error);
            setError("Неуспешно зареждане на потребител!");
        }
    };

    // ✅ Зареждане на налични поръчки за доставка
    const loadAvailableOrders = async () => {
        try {
            const response = await axios.get("http://localhost:8080/deliveries/available", { withCredentials: true });
            console.log("📌 Налични поръчки:", response.data);
            setAvailableOrders(response.data);
        } catch (error) {
            console.error("❌ Грешка при зареждане на налични поръчки:", error);
            setError("Грешка при зареждане на налични поръчки!");
        }
    };

    // ✅ Зареждане на текущи доставки за доставчика
    const loadDeliveries = async (deliverId) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/deliveries/${deliverId}`, { withCredentials: true });
            setDeliveries(response.data);
        } catch (error) {
            setError("Грешка при зареждане на текущите доставки!");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Приемане на поръчка за доставка
    const handleAcceptDelivery = async (orderId) => {
        if (!deliverId) return;
        try {
            await axios.post(`http://localhost:8080/deliveries/accept/${orderId}/${deliverId}`, {}, { withCredentials: true });
    
            // ✅ Премахваме приетата поръчка от наличните
            setAvailableOrders((prev) => prev.filter((order) => order.id !== orderId));
    
            // ✅ Презареждаме списъка с доставки, за да се покаже новата поръчка
            loadDeliveries(deliverId);
        } catch (error) {
            console.error("❌ Грешка при приемане на доставка:", error);
            setError("Неуспешно приемане на поръчка!");
        }
    };

    // ✅ Актуализиране на статус на доставка
    const handleStatusUpdate = async (deliveryId, newStatus) => {
        try {
            await axios.put(`http://localhost:8080/deliveries/${deliveryId}/status`, null, {
                params: { status: newStatus },
                withCredentials: true,
            });
            setDeliveries((prev) =>
                prev.map((d) => (d.id === deliveryId ? { ...d, status: newStatus } : d))
            );
        } catch (error) {
            setError("Грешка при актуализиране на статус на доставка!");
        }
    };

    // ✅ Логаут функция
    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/auth/logout", {}, { withCredentials: true });
            Cookies.remove("jwt_token"); // ✅ Изтриваме `jwt_token`
            navigate("/"); // ✅ Пренасочване към HomePage
            window.location.reload(); // ✅ Презареждане за изчистване на сесията
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Страница на доставчика</h1>

            {/* ✅ Налични поръчки за приемане */}
            <h2 className="text-xl font-semibold mt-4">Налични поръчки</h2>
            {availableOrders.length === 0 ? (
                <p>❌ Няма налични поръчки за доставка.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2 px-4 border">Поръчка №</th>
                            <th className="py-2 px-4 border">Ресторант</th>
                            <th className="py-2 px-4 border">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableOrders.map((order) => (
                            <tr key={order.id} className="border">
                                <td className="py-2 px-4">{order.id}</td>
                                <td className="py-2 px-4">{order.restaurant?.name || "Без име"}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleAcceptDelivery(order.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Приеми доставка
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h2 className="text-xl font-semibold mt-8">Моите доставки</h2>
{deliveries.length === 0 ? (
    <p>Нямате доставки в момента.</p>
) : (
    <table className="min-w-full bg-white border border-gray-300">
        <thead>
            <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Номер</th>
                <th className="py-2 px-4 border">Поръчка</th>
                <th className="py-2 px-4 border">Статус</th>
                <th className="py-2 px-4 border">Действия</th>
            </tr>
        </thead>
        <tbody>
            {deliveries.map((delivery) => (
                <tr key={delivery.id} className="border">
                    <td className="py-2 px-4">{delivery.id}</td>
                    <td className="py-2 px-4">Поръчка №{delivery.order.id}</td>
                    <td className="py-2 px-4">{delivery.status}</td>
                    <td className="py-2 px-4">
                        {delivery.status === "ASSIGNED" && (
                            <button
                                onClick={() => handleStatusUpdate(delivery.id, "IN_PROGRESS")}
                                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                            >
                                Започни
                            </button>
                        )}
                        {delivery.status === "IN_PROGRESS" && (
                            <button
                                onClick={() => handleStatusUpdate(delivery.id, "COMPLETED")}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Завърши
                            </button>
                        )}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
)}

            <button
                className="mt-6 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default DeliverPage;

import { useEffect, useState } from "react";
import axios from "axios";
import OrderStatusIndicator from "../components/OrderStatusIndicator";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserAndOrders = async () => {
            try {
                const userResponse = await axios.get("http://localhost:8080/auth/logged/user", { withCredentials: true });
                setUser(userResponse.data);
                
                if (userResponse.data) {
                    const ordersResponse = await axios.get(`http://localhost:8080/orders/customer/${userResponse.data.id}`, { withCredentials: true });
                    setOrders(ordersResponse.data);
                }
            } catch (error) {
                setError("Не сте логнати или сесията е изтекла.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndOrders();
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
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h1 className="text-3xl font-bold mb-4">Профил</h1>
                <div className="space-y-2">
                    <p><strong>Потребителско име:</strong> {user.username}</p>
                    <p><strong>Имейл:</strong> {user.email}</p>
                    <p><strong>Телефон:</strong> {user.phoneNumber}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">Моите Поръчки</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">Нямате направени поръчки.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {orders.map((order) => (
                            <div key={order.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold">Поръчка #{order.id}</h3>
                                        <p className="text-sm text-gray-600">
                                            Ресторант: {order.restaurant.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Адрес: {order.deliveryAddress}
                                        </p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Сума: {order.totalPrice.toFixed(2)} лв.
                                        </p>
                                    </div>
                                </div>
                                <OrderStatusIndicator status={order.status} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
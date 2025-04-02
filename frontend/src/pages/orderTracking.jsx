import { useEffect, useState } from "react";
import axios from "axios";
import OrderStatusIndicator from "../components/OrderStatusIndicator";

const OrderTrackingPage = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('active');

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

    const activeOrders = orders.filter(order => order.status !== 'DELIVERED');
    const completedOrders = orders.filter(order => order.status === 'DELIVERED');

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
                <h1 className="text-3xl font-bold mb-6">Проследяване на поръчки</h1>
                
                <div className="flex border-b mb-6">
                    <button
                        className={`px-6 py-2 text-lg font-medium ${
                            activeTab === 'active'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('active')}
                    >
                        Активни поръчки
                    </button>
                    <button
                        className={`px-6 py-2 text-lg font-medium ${
                            activeTab === 'history'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => setActiveTab('history')}
                    >
                        История на поръчките
                    </button>
                </div>

                {activeTab === 'active' && (
                    <div>
                        {activeOrders.length === 0 ? (
                            <p className="text-gray-500">Нямате активни поръчки.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">Поръчка #{order.id}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Ресторант: {order.restaurant.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Адрес: {order.deliveryAddress}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800 mt-2">
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
                )}

                {activeTab === 'history' && (
                    <div>
                        {completedOrders.length === 0 ? (
                            <p className="text-gray-500">Нямате завършени поръчки.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {completedOrders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">Поръчка #{order.id}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Ресторант: {order.restaurant.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Адрес: {order.deliveryAddress}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800 mt-2">
                                                    Сума: {order.totalPrice.toFixed(2)} лв.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full">
                                                Завършено
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrackingPage; 
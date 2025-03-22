import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RestaurantPage = () => {
    const { id } = useParams();
    const [customerId, setCustomerId] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [userRole, setUserRole] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/auth/me", {
                withCredentials: true,
            });
            setCustomerId(response.data.id);
            setUserRole(response.data.role);
            loadMenuItems();
        } catch (error) {
            console.error("Грешка при вземане на текущия потребител:", error);
            setError("Неуспешно зареждане на потребител!");
        }
    };

    const loadMenuItems = () => {
        if (!id) return;

        axios
            .get(`http://localhost:8080/menu/restaurant/${id}`, {
                withCredentials: true,
            })
            .then((res) => setMenuItems(res.data))
            .catch((err) => {
                console.error("Грешка при зареждане на менюто:", err);
                setError("Неуспешно зареждане на менюто.");
            });
    };

    const addToOrder = (item) => {
        const existing = orderItems.find((o) => o.menuItem.id === item.id);
        if (existing) {
            setOrderItems(
                orderItems.map((o) =>
                    o.menuItem.id === item.id
                        ? { ...o, quantity: o.quantity + 1 }
                        : o
                )
            );
        } else {
            setOrderItems([...orderItems, { menuItem: item, quantity: 1 }]);
        }
    };

    const decreaseFromOrder = (itemId) => {
        const existing = orderItems.find((o) => o.menuItem.id === itemId);
        if (!existing) return;

        if (existing.quantity === 1) {
            setOrderItems(orderItems.filter((o) => o.menuItem.id !== itemId));
        } else {
            setOrderItems(
                orderItems.map((o) =>
                    o.menuItem.id === itemId
                        ? { ...o, quantity: o.quantity - 1 }
                        : o
                )
            );
        }
    };

    const createOrder = () => {
        if (!customerId || !id || orderItems.length === 0) return;

        axios
            .post(
                `http://localhost:8080/orders/create/${customerId}/${id}`,
                orderItems,
                { withCredentials: true }
            )
            .then(() => {
                alert("✅ Поръчката е създадена успешно!");
                setOrderItems([]);
            })
            .catch((err) => {
                console.error("❌ Грешка при поръчване:", err);
                setError("Грешка при създаване на поръчката.");
            });
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Меню на ресторанта</h2>

            {error && <p className="text-red-500">{error}</p>}

            {userRole === "OWNER" && (
                <div className="mb-4">
                    <button
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        onClick={() => alert("🔧 Add Item - бъдеща функционалност")}
                    >
                        ➕ Add item to menu
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                    <div key={item.id} className="border p-4 rounded shadow bg-white">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p>Категория: {item.category}</p>
                        <p>Цена: {item.price.toFixed(2)} лв</p>

                        <button
                            onClick={() => addToOrder(item)}
                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Добави
                        </button>
                    </div>
                ))}
            </div>

            {orderItems.length > 0 && (
                <div className="mt-6 border-t pt-4">
                    <h3 className="text-xl font-bold mb-2">Твоята поръчка</h3>
                    <ul className="mb-2 space-y-2">
                        {orderItems.map((o) => (
                            <li key={o.menuItem.id} className="flex justify-between items-center">
                                <span>
                                    {o.menuItem.name} – {o.quantity} бр.
                                </span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => decreaseFromOrder(o.menuItem.id)}
                                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        −
                                    </button>
                                    <button
                                        onClick={() => addToOrder(o.menuItem)}
                                        className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        +
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={createOrder}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Потвърди поръчката
                    </button>
                </div>
            )}
        </div>
    );
};

export default RestaurantPage;

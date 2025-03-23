import { useEffect, useState } from "react";
import axios from "axios";
import "../css/AddItemModal.css";

const AddItemModal = ({ isOpen, close, restaurantId, reloadMenu }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        category: "PIZZA"
    });
    
    const categories = ["PIZZA", "PASTA", "DESSERT", "DRINK", "SALAD", "BURGER"];

    useEffect(() => {
        if (isOpen) {
            loadMenuItems();
        }
    }, [isOpen]);

    const loadMenuItems = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/menu/restaurant/${restaurantId}`, {
                withCredentials: true
            });
            setMenuItems(res.data);
        } catch (err) {
            console.error("Грешка при зареждане на менюто:", err);
        }
    };

    const handleAdd = async () => {
        if (!newItem.name || !newItem.price || !newItem.category) {
            alert("Моля, попълнете всички полета.");
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/menu/add/${restaurantId}`,
                newItem,
                { withCredentials: true }
            );
            setNewItem({ name: "", price: "", category: "PIZZA" });
            loadMenuItems();
            if (reloadMenu) reloadMenu();
        } catch (err) {
            console.error("Грешка при добавяне:", err);
            console.error("Грешка:", err);
            if (err.response) {
                console.error("Сървърен отговор:", err.response.data);
            }
        }
        
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/menu/${id}`, { withCredentials: true });
            loadMenuItems();
            if (reloadMenu) reloadMenu();
        } catch (err) {
            console.error("Грешка при изтриване:", err);
            if (err.response) {
                console.error("Сървърен отговор:", err.response.data);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="custom-overlay">
            <div className="custom-modal">
                <button onClick={close} className="custom-close">✖</button>
                <div className="custom-content">
                    {/* Таблица с ястия */}
                    <div className="custom-table">
                        <h2>Меню</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Име</th>
                                    <th>Категория</th>
                                    <th>Цена</th>
                                    <th>Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price.toFixed(2)} лв</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="delete-button"
                                            >
                                                🗑</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Форма за добавяне */}
                    <div className="custom-form">
                        <h2>Добави ястие</h2>
                        <input
                            type="text"
                            placeholder="Име"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Цена"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                        />
                        <select
                            value={newItem.category}
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <button onClick={handleAdd}>Добави</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;

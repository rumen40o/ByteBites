import { useEffect, useState } from "react";
import "../css/AddItemModal.css";
import {
    getMenuByRestaurant,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem
} from '../api/api'

const AddItemModal = ({ isOpen, close, restaurantId, reloadMenu }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        category: "PIZZA"
    });
    const [editingItemId, setEditingItemId] = useState(null);

    const categories = ["PIZZA", "PASTA", "SANDWICH", "SUSHI", "DONER", "BURGER"];

    useEffect(() => {
        if (isOpen) {
            loadMenuItems();
        }
    }, [isOpen]);

    const loadMenuItems = async () => {
        try {
            const res = await getMenuByRestaurant(restaurantId)
            setMenuItems(res.data);
        } catch (err) {
            console.error("Грешка при зареждане на менюто:", err);
        }
    };

    const handleAddOrUpdate = async () => {
        if (!newItem.name || !newItem.price || !newItem.category) {
            alert("Моля, попълнете всички полета.");
            return;
        }

        try {
            if (editingItemId) {
                
                await updateMenuItem(editingItemId, newItem)
            } else {
                
                await addMenuItem(restaurantId, newItem)
            }

            setNewItem({ name: "", price: "", category: "PIZZA" });
            setEditingItemId(null);
            loadMenuItems();
            if (reloadMenu) reloadMenu();
        } catch (err) {
            console.error("Грешка при добавяне/редакция:", err);
            if (err.response) {
                console.error("Сървърен отговор:", err.response.data);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMenuItem(id)
            loadMenuItems();
            if (reloadMenu) reloadMenu();
        } catch (err) {
            console.error("Грешка при изтриване:", err);
            if (err.response) {
                console.error("Сървърен отговор:", err.response.data);
            }
        }
    };

    const handleEdit = (item) => {
        setNewItem({
            name: item.name,
            price: item.price,
            category: item.category
        });
        setEditingItemId(item.id);
    };

    if (!isOpen) return null;

    return (
        <div className="custom-overlay">
            <div className="custom-modal">
                <button onClick={close} className="custom-close">✖</button>
                <div className="custom-content">
                    
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
                                                onClick={() => handleEdit(item)}
                                                className="edit-button"
                                            >
                                                ✏
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="delete-button"
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    
                    <div className="custom-form">
                        <h2>{editingItemId ? "Редактирай ястие" : "Добави ястие"}</h2>
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
                        <button onClick={handleAddOrUpdate}>
                            {editingItemId ? "Запази промените" : "Добави"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddItemModal;

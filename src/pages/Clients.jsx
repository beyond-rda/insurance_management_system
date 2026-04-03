import React, { useState } from "react";
import "../styles/Policies.scss";
import "../styles/Clients.scss";

// Sample clients data
const initialClients = [
    { id: 1, name: "John Mugisha", email: "john@gmail.com", phone: "0781234567", nationalId: "1199012345678", policy: "Health Basic", status: "Active" },
    { id: 2, name: "Alice Uwase", email: "alice@gmail.com", phone: "0722345678", nationalId: "1199512345678", policy: "Motor Cover", status: "Active" },
    { id: 3, name: "Bob Nkurunziza", email: "bob@gmail.com", phone: "0733456789", nationalId: "1200012345678", policy: "Life Assurance", status: "Inactive" },
    { id: 4, name: "Grace Mutoni", email: "grace@gmail.com", phone: "0744567890", nationalId: "1199812345678", policy: "Property Shield", status: "Pending" },
];

function Clients() {

    // List of clients
    const [clients, setClients] = useState(initialClients);

    // Controls which popup is open: null, "add", "view", "delete"
    const [popup, setPopup] = useState(null);

    // Currently selected client
    const [selected, setSelected] = useState(null);

    // Search text
    const [search, setSearch] = useState("");

    // Form values for adding new client
    const [form, setForm] = useState({
        name: "", email: "", phone: "", nationalId: "", policy: "Health Basic", status: "Active"
    });

    // Form errors
    const [errors, setErrors] = useState({});

    // Open view popup
    const openView = (client) => {
        setSelected(client);
        setPopup("view");
    };

    // Open delete popup
    const openDelete = (client) => {
        setSelected(client);
        setPopup("delete");
    };

    // Delete selected client
    const deleteClient = () => {
        setClients(clients.filter((c) => c.id !== selected.id));
        setPopup(null);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validate form before saving
    const validate = () => {
        let newErrors = {};

        // Name required
        if (!form.name) newErrors.name = "Name is required";

        // Email must be valid
        if (!form.email.includes("@")) newErrors.email = "Enter a valid email";

        // Phone must be numbers only
        if (!/^\d+$/.test(form.phone)) newErrors.phone = "Phone must be numbers only";

        // National ID must be numbers only
        if (!/^\d+$/.test(form.nationalId)) newErrors.nationalId = "National ID must be numbers only";

        setErrors(newErrors);

        // If no errors return true
        return Object.keys(newErrors).length === 0;
    };

    // Save new client
    const saveClient = () => {
        if (!validate()) return;

        const newClient = {
            id: clients.length + 1,
            ...form,
        };
        setClients([...clients, newClient]);
        setPopup(null);
        setForm({ name: "", email: "", phone: "", nationalId: "", policy: "Health Basic", status: "Active" });
        setErrors({});
    };

    // Filter clients by search
    const filtered = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="clients">

            {/* Page header */}
            <div className="clients__header">
                <h1 className="clients__title">👥 Clients</h1>
                <button className="btn-add" onClick={() => setPopup("add")}>
                    + Add New Client
                </button>
            </div>

            {/* Search bar */}
            <input
                className="search__bar"
                type="text"
                placeholder="🔍 Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Clients Table */}
            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>National ID</th>
                            <th>Policy</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((client) => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td>{client.phone}</td>
                                <td>{client.nationalId}</td>
                                <td>{client.policy}</td>
                                <td>
                                    <span className={`badge badge--${client.status.toLowerCase()}`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-view" onClick={() => openView(client)}>
                                        👁 View
                                    </button>
                                    <button className="btn-delete" onClick={() => openDelete(client)}>
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD NEW CLIENT POPUP */}
            {popup === "add" && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">➕ Add New Client</h2>

                        <div className="form__group">
                            <label>Full Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Mugisha" />
                            {/* Show error if name is missing */}
                            {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>}
                        </div>

                        <div className="form__group">
                            <label>Email *</label>
                            <input name="email" value={form.email} onChange={handleChange} placeholder="e.g. john@gmail.com" />
                            {errors.email && <p style={{ color: "red", fontSize: "12px" }}>{errors.email}</p>}
                        </div>

                        <div className="form__group">
                            <label>Phone Number *</label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 0781234567" />
                            {errors.phone && <p style={{ color: "red", fontSize: "12px" }}>{errors.phone}</p>}
                        </div>

                        <div className="form__group">
                            <label>National ID *</label>
                            <input name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="e.g. 1199012345678" />
                            {errors.nationalId && <p style={{ color: "red", fontSize: "12px" }}>{errors.nationalId}</p>}
                        </div>

                        <div className="form__group">
                            <label>Policy</label>
                            <select name="policy" value={form.policy} onChange={handleChange}>
                                <option>Health Basic</option>
                                <option>Motor Cover</option>
                                <option>Property Shield</option>
                                <option>Life Assurance</option>
                            </select>
                        </div>

                        <div className="form__group">
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Pending</option>
                            </select>
                        </div>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-save" onClick={saveClient}>Save Client</button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW CLIENT POPUP */}
            {popup === "view" && selected && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">👁 Client Details</h2>

                        <p className="details__item"><span>Name:</span> {selected.name}</p>
                        <p className="details__item"><span>Email:</span> {selected.email}</p>
                        <p className="details__item"><span>Phone:</span> {selected.phone}</p>
                        <p className="details__item"><span>National ID:</span> {selected.nationalId}</p>
                        <p className="details__item"><span>Policy:</span> {selected.policy}</p>
                        <p className="details__item"><span>Status:</span> {selected.status}</p>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION POPUP */}
            {popup === "delete" && selected && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">🗑 Delete Client</h2>
                        <p>Are you sure you want to delete <strong>{selected.name}</strong>?</p>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-confirm-delete" onClick={deleteClient}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Clients;
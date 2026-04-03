import React, { useState } from "react";
import "../styles/Policies.scss";

// Sample policies data
const initialPolicies = [
    { id: 1, name: "Health Basic", type: "Health", premium: "$200", duration: "1 Year", status: "Active", description: "Covers basic health needs.", file: null },
    { id: 2, name: "Motor Cover", type: "Motor", premium: "$150", duration: "1 Year", status: "Active", description: "Covers vehicle accidents.", file: null },
    { id: 3, name: "Property Shield", type: "Property", premium: "$300", duration: "2 Years", status: "Inactive", description: "Covers property damage.", file: null },
    { id: 4, name: "Life Assurance", type: "Life", premium: "$250", duration: "5 Years", status: "Pending", description: "Life insurance cover.", file: null },
];

function Policies() {

    // List of policies
    const [policies, setPolicies] = useState(initialPolicies);

    // Controls which popup is open: null, "add", "view", "delete"
    const [popup, setPopup] = useState(null);

    // The policy currently selected
    const [selected, setSelected] = useState(null);

    // Search text
    const [search, setSearch] = useState("");

    // New policy form values
    const [form, setForm] = useState({
        name: "", type: "Health", premium: "", duration: "", status: "Active", description: "", file: null
    });

    // Image preview
    const [preview, setPreview] = useState(null);

    // Open view popup
    const openView = (policy) => {
        setSelected(policy);
        setPopup("view");
    };

    // Open delete popup
    const openDelete = (policy) => {
        setSelected(policy);
        setPopup("delete");
    };

    // Delete the selected policy
    const deletePolicy = () => {
        setPolicies(policies.filter((p) => p.id !== selected.id));
        setPopup(null);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle file upload
    const handleFile = (e) => {
        const file = e.target.files[0];
        setForm({ ...form, file });
        setPreview(URL.createObjectURL(file));
    };

    // Save new policy
    const savePolicy = () => {
        // Validation
        if (!form.name || !form.premium || !form.duration) {
            alert("Please fill all required fields!");
            return;
        }
        const newPolicy = {
            id: policies.length + 1,
            ...form,
            premium: "$" + form.premium,
        };
        setPolicies([...policies, newPolicy]);
        setPopup(null);
        setForm({ name: "", type: "Health", premium: "", duration: "", status: "Active", description: "", file: null });
        setPreview(null);
    };

    // Filter policies by search
    const filtered = policies.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="policies">

            {/* Page header */}
            <div className="policies__header">
                <h1 className="policies__title">📄 Policies</h1>
                <button className="btn-add" onClick={() => setPopup("add")}>
                    + Add New Policy
                </button>
            </div>

            {/* Search bar */}
            <input
                className="search__bar"
                type="text"
                placeholder="🔍 Search policies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Policies Table */}
            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Policy Name</th>
                            <th>Type</th>
                            <th>Premium</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((policy) => (
                            <tr key={policy.id}>
                                <td>{policy.id}</td>
                                <td>{policy.name}</td>
                                <td>{policy.type}</td>
                                <td>{policy.premium}</td>
                                <td>{policy.duration}</td>
                                <td>
                                    <span className={`badge badge--${policy.status.toLowerCase()}`}>
                                        {policy.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-view" onClick={() => openView(policy)}>
                                        👁 View
                                    </button>
                                    <button className="btn-delete" onClick={() => openDelete(policy)}>
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD NEW POLICY POPUP */}
            {popup === "add" && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">➕ Add New Policy</h2>

                        <div className="form__group">
                            <label>Policy Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Health Premium" />
                        </div>

                        <div className="form__group">
                            <label>Type *</label>
                            <select name="type" value={form.type} onChange={handleChange}>
                                <option>Health</option>
                                <option>Motor</option>
                                <option>Property</option>
                                <option>Life</option>
                            </select>
                        </div>

                        <div className="form__group">
                            <label>Premium Amount ($) *</label>
                            <input name="premium" value={form.premium} onChange={handleChange} placeholder="e.g. 200" type="number" />
                        </div>

                        <div className="form__group">
                            <label>Duration *</label>
                            <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 1 Year" />
                        </div>

                        <div className="form__group">
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Pending</option>
                            </select>
                        </div>

                        <div className="form__group">
                            <label>Upload Brochure (Image/PDF)</label>
                            <input type="file" accept="image/*,.pdf" onChange={handleFile} />
                            {preview && <img className="preview__img" src={preview} alt="preview" />}
                        </div>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-save" onClick={savePolicy}>Save Policy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW POLICY POPUP */}
            {popup === "view" && selected && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">👁 Policy Details</h2>

                        <p className="details__item"><span>Name:</span> {selected.name}</p>
                        <p className="details__item"><span>Type:</span> {selected.type}</p>
                        <p className="details__item"><span>Premium:</span> {selected.premium}</p>
                        <p className="details__item"><span>Duration:</span> {selected.duration}</p>
                        <p className="details__item"><span>Status:</span> {selected.status}</p>
                        <p className="details__item"><span>Description:</span> {selected.description}</p>

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
                        <h2 className="popup__title">🗑 Delete Policy</h2>
                        <p>Are you sure you want to delete <strong>{selected.name}</strong>?</p>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-confirm-delete" onClick={deletePolicy}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Policies;
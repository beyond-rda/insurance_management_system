import React, { useState } from "react";
import "../styles/Policies.scss";
import "../styles/Claims.scss";

// Sample claims data
const initialClaims = [
    { id: 1, client: "John Mugisha", policy: "Health Basic", amount: "$500", date: "2024-01-15", reason: "Hospital admission", status: "Pending" },
    { id: 2, client: "Alice Uwase", policy: "Motor Cover", amount: "$1200", date: "2024-02-10", reason: "Car accident repair", status: "Pending" },
    { id: 3, client: "Bob Nkurunziza", policy: "Life Assurance", amount: "$3000", date: "2024-03-05", reason: "Critical illness", status: "Approved" },
    { id: 4, client: "Grace Mutoni", policy: "Property Shield", amount: "$800", date: "2024-03-20", reason: "Fire damage", status: "Rejected" },
];

function Claims() {

    // List of claims
    const [claims, setClaims] = useState(initialClaims);

    // Controls which popup is open
    const [popup, setPopup] = useState(null);

    // Currently selected claim
    const [selected, setSelected] = useState(null);

    // Search text
    const [search, setSearch] = useState("");

    // Form for adding new claim
    const [form, setForm] = useState({
        client: "", policy: "Health Basic", amount: "", date: "", reason: ""
    });

    // Form errors
    const [errors, setErrors] = useState({});

    // Open view popup
    const openView = (claim) => {
        setSelected(claim);
        setPopup("view");
    };

    // Open delete popup
    const openDelete = (claim) => {
        setSelected(claim);
        setPopup("delete");
    };

    // Approve a claim — changes its status to Approved
    const approveClaim = (id) => {
        setClaims(claims.map((c) =>
            c.id === id ? { ...c, status: "Approved" } : c
        ));
    };

    // Reject a claim — changes its status to Rejected
    const rejectClaim = (id) => {
        setClaims(claims.map((c) =>
            c.id === id ? { ...c, status: "Rejected" } : c
        ));
    };

    // Delete selected claim
    const deleteClaim = () => {
        setClaims(claims.filter((c) => c.id !== selected.id));
        setPopup(null);
    };

    // Handle form changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Validate form
    const validate = () => {
        let newErrors = {};
        if (!form.client) newErrors.client = "Client name is required";
        if (!form.amount || isNaN(form.amount)) newErrors.amount = "Amount must be a number";
        if (!form.date) newErrors.date = "Date is required";
        if (!form.reason) newErrors.reason = "Reason is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save new claim
    const saveClaim = () => {
        if (!validate()) return;
        const newClaim = {
            id: claims.length + 1,
            ...form,
            amount: "$" + form.amount,
            status: "Pending",
        };
        setClaims([...claims, newClaim]);
        setPopup(null);
        setForm({ client: "", policy: "Health Basic", amount: "", date: "", reason: "" });
        setErrors({});
    };

    // Filter claims by search
    const filtered = claims.filter((c) =>
        c.client.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="claims">

            {/* Page header */}
            <div className="claims__header">
                <h1 className="claims__title">📋 Claims</h1>
                <button className="btn-add" onClick={() => setPopup("add")}>
                    + Add New Claim
                </button>
            </div>

            {/* Search bar */}
            <input
                className="search__bar"
                type="text"
                placeholder="🔍 Search claims..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Claims Table */}
            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client</th>
                            <th>Policy</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((claim) => (
                            <tr key={claim.id}>
                                <td>{claim.id}</td>
                                <td>{claim.client}</td>
                                <td>{claim.policy}</td>
                                <td>{claim.amount}</td>
                                <td>{claim.date}</td>
                                <td>
                                    {/* Show colored badge based on status */}
                                    <span className={`badge badge--${claim.status.toLowerCase()}`}>
                                        {claim.status}
                                    </span>
                                </td>
                                <td>
                                    {/* Only show Approve/Reject if claim is still Pending */}
                                    {claim.status === "Pending" && (
                                        <>
                                            <button className="btn-approve" onClick={() => approveClaim(claim.id)}>
                                                ✅ Approve
                                            </button>
                                            <button className="btn-reject" onClick={() => rejectClaim(claim.id)}>
                                                ❌ Reject
                                            </button>
                                        </>
                                    )}
                                    <button className="btn-view" onClick={() => openView(claim)}>
                                        👁 View
                                    </button>
                                    <button className="btn-delete" onClick={() => openDelete(claim)}>
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD NEW CLAIM POPUP */}
            {popup === "add" && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">➕ Add New Claim</h2>

                        <div className="form__group">
                            <label>Client Name *</label>
                            <input name="client" value={form.client} onChange={handleChange} placeholder="e.g. John Mugisha" />
                            {errors.client && <p style={{ color: "red", fontSize: "12px" }}>{errors.client}</p>}
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
                            <label>Claim Amount ($) *</label>
                            <input name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 500" type="number" />
                            {errors.amount && <p style={{ color: "red", fontSize: "12px" }}>{errors.amount}</p>}
                        </div>

                        <div className="form__group">
                            <label>Date *</label>
                            <input name="date" value={form.date} onChange={handleChange} type="date" />
                            {errors.date && <p style={{ color: "red", fontSize: "12px" }}>{errors.date}</p>}
                        </div>

                        <div className="form__group">
                            <label>Reason *</label>
                            <input name="reason" value={form.reason} onChange={handleChange} placeholder="e.g. Hospital admission" />
                            {errors.reason && <p style={{ color: "red", fontSize: "12px" }}>{errors.reason}</p>}
                        </div>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-save" onClick={saveClaim}>Save Claim</button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW CLAIM POPUP */}
            {popup === "view" && selected && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">👁 Claim Details</h2>

                        <p className="details__item"><span>Client:</span> {selected.client}</p>
                        <p className="details__item"><span>Policy:</span> {selected.policy}</p>
                        <p className="details__item"><span>Amount:</span> {selected.amount}</p>
                        <p className="details__item"><span>Date:</span> {selected.date}</p>
                        <p className="details__item"><span>Reason:</span> {selected.reason}</p>
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
                        <h2 className="popup__title">🗑 Delete Claim</h2>
                        <p>Are you sure you want to delete <strong>{selected.client}</strong>'s claim?</p>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-confirm-delete" onClick={deleteClaim}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Claims;
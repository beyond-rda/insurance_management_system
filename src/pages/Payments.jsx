import React, { useState } from "react";
import "../styles/Policies.scss";
import "../styles/Payments.scss";

// Sample payments data
const initialPayments = [
    { id: 1, client: "John Mugisha", policy: "Health Basic", amount: "$200", date: "2024-01-10", method: "Mobile Money", status: "Paid" },
    { id: 2, client: "Alice Uwase", policy: "Motor Cover", amount: "$150", date: "2024-02-05", method: "Bank Transfer", status: "Paid" },
    { id: 3, client: "Bob Nkurunziza", policy: "Life Assurance", amount: "$250", date: "2024-03-01", method: "Cash", status: "Unpaid" },
    { id: 4, client: "Grace Mutoni", policy: "Property Shield", amount: "$300", date: "2024-03-15", method: "Mobile Money", status: "Overdue" },
];

function Payments() {

    // List of payments
    const [payments, setPayments] = useState(initialPayments);

    // Controls which popup is open
    const [popup, setPopup] = useState(null);

    // Currently selected payment
    const [selected, setSelected] = useState(null);

    // Search text
    const [search, setSearch] = useState("");

    // Form for adding new payment
    const [form, setForm] = useState({
        client: "", policy: "Health Basic", amount: "", date: "", method: "Mobile Money", status: "Paid"
    });

    // Form errors
    const [errors, setErrors] = useState({});

    // Open view popup
    const openView = (payment) => {
        setSelected(payment);
        setPopup("view");
    };

    // Open delete popup
    const openDelete = (payment) => {
        setSelected(payment);
        setPopup("delete");
    };

    // Delete selected payment
    const deletePayment = () => {
        setPayments(payments.filter((p) => p.id !== selected.id));
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
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save new payment
    const savePayment = () => {
        if (!validate()) return;
        const newPayment = {
            id: payments.length + 1,
            ...form,
            amount: "$" + form.amount,
        };
        setPayments([...payments, newPayment]);
        setPopup(null);
        setForm({ client: "", policy: "Health Basic", amount: "", date: "", method: "Mobile Money", status: "Paid" });
        setErrors({});
    };

    // Filter payments by search
    const filtered = payments.filter((p) =>
        p.client.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="payments">

            {/* Page header */}
            <div className="payments__header">
                <h1 className="payments__title">💳 Payments</h1>
                <button className="btn-add" onClick={() => setPopup("add")}>
                    + Add New Payment
                </button>
            </div>

            {/* Search bar */}
            <input
                className="search__bar"
                type="text"
                placeholder="🔍 Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Payments Table */}
            <div className="table-box">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Client</th>
                            <th>Policy</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((payment) => (
                            <tr key={payment.id}>
                                <td>{payment.id}</td>
                                <td>{payment.client}</td>
                                <td>{payment.policy}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.date}</td>
                                <td>{payment.method}</td>
                                <td>
                                    <span className={`badge badge--${payment.status.toLowerCase()}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-view" onClick={() => openView(payment)}>
                                        👁 View
                                    </button>
                                    <button className="btn-delete" onClick={() => openDelete(payment)}>
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ADD NEW PAYMENT POPUP */}
            {popup === "add" && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">➕ Add New Payment</h2>

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
                            <label>Amount ($) *</label>
                            <input name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 200" type="number" />
                            {errors.amount && <p style={{ color: "red", fontSize: "12px" }}>{errors.amount}</p>}
                        </div>

                        <div className="form__group">
                            <label>Date *</label>
                            <input name="date" value={form.date} onChange={handleChange} type="date" />
                            {errors.date && <p style={{ color: "red", fontSize: "12px" }}>{errors.date}</p>}
                        </div>

                        <div className="form__group">
                            <label>Payment Method</label>
                            <select name="method" value={form.method} onChange={handleChange}>
                                <option>Mobile Money</option>
                                <option>Bank Transfer</option>
                                <option>Cash</option>
                            </select>
                        </div>

                        <div className="form__group">
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option>Paid</option>
                                <option>Unpaid</option>
                                <option>Overdue</option>
                            </select>
                        </div>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-save" onClick={savePayment}>Save Payment</button>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW PAYMENT POPUP */}
            {popup === "view" && selected && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">👁 Payment Details</h2>

                        <p className="details__item"><span>Client:</span> {selected.client}</p>
                        <p className="details__item"><span>Policy:</span> {selected.policy}</p>
                        <p className="details__item"><span>Amount:</span> {selected.amount}</p>
                        <p className="details__item"><span>Date:</span> {selected.date}</p>
                        <p className="details__item"><span>Method:</span> {selected.method}</p>
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
                        <h2 className="popup__title">🗑 Delete Payment</h2>
                        <p>Are you sure you want to delete <strong>{selected.client}</strong>'s payment?</p>

                        <div className="popup__buttons">
                            <button className="btn-cancel" onClick={() => setPopup(null)}>Cancel</button>
                            <button className="btn-confirm-delete" onClick={deletePayment}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Payments;
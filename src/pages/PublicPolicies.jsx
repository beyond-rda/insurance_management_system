import React, { useState } from "react";
import "../styles/PublicPolicies.scss";

const availablePolicies = [
    { id: 1, name: "Health Insurance", type: "Health", premium: "$75", duration: "Month", description: "Health cover with plan type, coverage amount, and pre-existing condition details." },
    { id: 2, name: "Auto Insurance", type: "Auto", premium: "$90", duration: "Month", description: "Vehicle cover with third party or comprehensive protection options." },
    { id: 3, name: "Home Insurance", type: "Home", premium: "$65", duration: "Month", description: "Home protection for apartments and houses with configurable coverage." },
    { id: 4, name: "Mutuelle de Sante", type: "Mutuelle", premium: "$3", duration: "Month", description: "Rwanda community-based health insurance for affordable household medical access." },
];

function PublicPolicies() {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", policy: "", message: ""
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let newErrors = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email.includes("@")) newErrors.email = "Enter a valid email";
        if (!form.phone) newErrors.phone = "Phone is required";
        if (!form.policy) newErrors.policy = "Please select a policy";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="public__page">
                <div className="public__success">
                    <h1>✅ Thank You!</h1>
                    <p>Your request for <strong>{form.policy}</strong> has been submitted.</p>
                    <p>Our team will contact you at <strong>{form.email}</strong> within 24 hours.</p>
                    <button className="btn-primary" onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", phone: "", policy: "", message: "" });
                    }}>
                        Submit Another Request
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="public__page">
            <div className="public__header">
                <h1>🛡️ BMUHIRE Insurance</h1>
                <p>Protect what matters most with our reliable insurance plans</p>
            </div>

            <div className="public__content">
                <section className="public__policies">
                    <h2>Available Insurance Plans</h2>
                    <div className="policy__grid">
                        {availablePolicies.map((policy) => (
                            <div key={policy.id} className="policy__card">
                                <div className="policy__icon">
                                    {policy.type === "Health" && "🏥"}
                                    {policy.type === "Auto" && "🚗"}
                                    {policy.type === "Home" && "🏠"}
                                    {policy.type === "Mutuelle" && "🩺"}
                                </div>
                                <h3>{policy.name}</h3>
                                <p className="policy__type">{policy.type} Insurance</p>
                                <p className="policy__desc">{policy.description}</p>
                                <div className="policy__price">
                                    <span className="price__amount">{policy.premium}</span>
                                    <span className="price__duration">/ {policy.duration}</span>
                                </div>
                                <button 
                                    className="btn-select"
                                    onClick={() => setForm({ ...form, policy: policy.name })}
                                >
                                    Select This Plan
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="public__form">
                    <h2>Request a Quote</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form__group">
                            <label>Full Name *</label>
                            <input 
                                name="name" 
                                value={form.name} 
                                onChange={handleChange} 
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="error">{errors.name}</p>}
                        </div>

                        <div className="form__group">
                            <label>Email Address *</label>
                            <input 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} 
                                placeholder="Enter your email"
                                type="email"
                            />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>

                        <div className="form__group">
                            <label>Phone Number *</label>
                            <input 
                                name="phone" 
                                value={form.phone} 
                                onChange={handleChange} 
                                placeholder="Enter your phone number"
                            />
                            {errors.phone && <p className="error">{errors.phone}</p>}
                        </div>

                        <div className="form__group">
                            <label>Select Policy *</label>
                            <select name="policy" value={form.policy} onChange={handleChange}>
                                <option value="">-- Select a Policy --</option>
                                {availablePolicies.map((p) => (
                                    <option key={p.id} value={p.name}>{p.name} - {p.premium}</option>
                                ))}
                            </select>
                            {errors.policy && <p className="error">{errors.policy}</p>}
                        </div>

                        <div className="form__group">
                            <label>Additional Message</label>
                            <textarea 
                                name="message" 
                                value={form.message} 
                                onChange={handleChange} 
                                placeholder="Any additional information..."
                                rows="4"
                            />
                        </div>

                        <button type="submit" className="btn-submit">
                            Submit Request
                        </button>
                    </form>
                </section>
            </div>

            <div className="public__footer">
                <p>Need help? Call us: +250 788 123 456 | Email: info@bmuhire.rw</p>
            </div>
        </div>
    );
}

export default PublicPolicies;

import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../styles/Policies.scss";

// Sample policies data
const initialPolicies = [
    { id: 1, name: "Health Basic", type: "Health", premium: "$200", duration: "1 Year", status: "Active", description: "Covers basic health needs.", file: null },
    { id: 2, name: "Motor Cover", type: "Motor", premium: "$150", duration: "1 Year", status: "Active", description: "Covers vehicle accidents.", file: null },
    { id: 3, name: "Property Shield", type: "Property", premium: "$300", duration: "2 Years", status: "Inactive", description: "Covers property damage.", file: null },
    { id: 4, name: "Life Assurance", type: "Life", premium: "$250", duration: "5 Years", status: "Pending", description: "Life insurance cover.", file: null },
    { id: 5, name: "Health Premium", type: "Health", premium: "$400", duration: "1 Year", status: "Active", description: "Premium health coverage.", file: null },
    { id: 6, name: "Motor Third Party", type: "Motor", premium: "$100", duration: "1 Year", status: "Pending", description: "Third party motor cover.", file: null },
];

function Policies() {

    // List of policies
    const [policies, setPolicies] = useState(initialPolicies);

    // Controls which popup is open
    const [popup, setPopup] = useState(null);

    // Currently selected policy
    const [selected, setSelected] = useState(null);

    // New policy form values
    const [form, setForm] = useState({
        name: "", type: "Health", premium: "", duration: "", status: "Active", description: "", file: null
    });

    // Image preview
    const [preview, setPreview] = useState(null);

    // Form errors
    const [errors, setErrors] = useState({});

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

    // Delete selected policy
    const deletePolicy = () => {
        setPolicies(policies.filter((p) => p.id !== selected.id));
        setPopup(null);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle file upload with type and size validation
    const handleFile = (e) => {
        const file = e.target.files[0];

        // File type validation — only images and PDFs allowed
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG or PDF files are allowed!");
            return;
        }

        // File size validation — max 2MB
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            alert("File size must be less than 2MB!");
            return;
        }

        setForm({ ...form, file });
        // Only show preview for images
        if (file.type.startsWith("image/")) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
        }
    };

    // Validate form
    const validate = () => {
        let newErrors = {};
        if (!form.name) newErrors.name = "Policy name is required";
        if (!form.premium) newErrors.premium = "Premium is required";
        if (!form.duration) newErrors.duration = "Duration is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Save new policy
    const savePolicy = () => {
        if (!validate()) return;
        const newPolicy = {
            id: policies.length + 1,
            ...form,
            premium: "$" + form.premium,
        };
        setPolicies([...policies, newPolicy]);
        setPopup(null);
        setForm({ name: "", type: "Health", premium: "", duration: "", status: "Active", description: "", file: null });
        setPreview(null);
        setErrors({});
    };

    // DataGrid columns definition
    const columns = [
        { field: "id", headerName: "#", width: 60 },
        { field: "name", headerName: "Policy Name", width: 180 },
        { field: "type", headerName: "Type", width: 120 },
        { field: "premium", headerName: "Premium", width: 120 },
        { field: "duration", headerName: "Duration", width: 120 },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            // Render colored badge for status
            renderCell: (params) => (
                <span className={`badge badge--${params.value.toLowerCase()}`}>
                    {params.value}
                </span>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 200,
            sortable: false,
            // Render action buttons
            renderCell: (params) => (
                <>
                    <button className="btn-view" onClick={() => openView(params.row)}>
                        👁 View
                    </button>
                    <button className="btn-delete" onClick={() => openDelete(params.row)}>
                        🗑 Delete
                    </button>
                </>
            ),
        },
    ];

    return (
        <div className="policies">

            {/* Page header */}
            <div className="policies__header">
                <h1 className="policies__title">📄 Policies</h1>
                <button className="btn-add" onClick={() => setPopup("add")}>
                    + Add New Policy
                </button>
            </div>

            {/* MUI DataGrid — has sorting, filtering, pagination built in */}
            <div className="table-box" style={{ height: 420, width: "100%" }}>
                <DataGrid
                    rows={policies}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                />
            </div>

            {/* ADD NEW POLICY POPUP */}
            {popup === "add" && (
                <div className="popup__overlay">
                    <div className="popup__box">
                        <h2 className="popup__title">➕ Add New Policy</h2>

                        <div className="form__group">
                            <label>Policy Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Health Premium" />
                            {errors.name && <p style={{ color: "red", fontSize: "12px" }}>{errors.name}</p>}
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
                            {errors.premium && <p style={{ color: "red", fontSize: "12px" }}>{errors.premium}</p>}
                        </div>

                        <div className="form__group">
                            <label>Duration *</label>
                            <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 1 Year" />
                            {errors.duration && <p style={{ color: "red", fontSize: "12px" }}>{errors.duration}</p>}
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
                            <label>Upload Brochure (JPG, PNG or PDF — max 2MB)</label>
                            <input type="file" accept="image/*,.pdf" onChange={handleFile} />
                            {/* Show image preview if file is an image */}
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
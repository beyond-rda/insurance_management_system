import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid,
    PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/Reports.scss";

// Chart 1 — Branch performance data
const branchData = [
    { branch: "Kigali", policies: 80 },
    { branch: "Huye", policies: 45 },
    { branch: "Musanze", policies: 60 },
    { branch: "Rubavu", policies: 35 },
    { branch: "Karongi", policies: 50 },
];

// Chart 2 — Premium income trend per month
const incomeData = [
    { month: "Jan", income: 4000 },
    { month: "Feb", income: 5200 },
    { month: "Mar", income: 4800 },
    { month: "Apr", income: 6100 },
    { month: "May", income: 5500 },
    { month: "Jun", income: 7000 },
];

// Chart 3 — Risk levels across policy categories
const riskData = [
    { name: "Low Risk", value: 40 },
    { name: "Medium Risk", value: 35 },
    { name: "High Risk", value: 25 },
];

// Chart 4 — Claim frequency per month
const claimFrequency = [
    { month: "Jan", claims: 20 },
    { month: "Feb", claims: 35 },
    { month: "Mar", claims: 28 },
    { month: "Apr", claims: 50 },
    { month: "May", claims: 42 },
    { month: "Jun", claims: 38 },
];

// Colors for pie chart
const COLORS = ["#66bb6a", "#ffa726", "#ef5350"];

function Reports() {
    return (
        <div className="reports">

            <h1 className="reports__title">📈 Reports & Analytics</h1>

            <div className="reports__grid">

                {/* Chart 1 — Branch Performance */}
                <div className="report__card">
                    <h3>🏢 Branch Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={branchData}>
                            <XAxis dataKey="branch" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="policies" fill="#1565c0" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart 2 — Premium Income Trend */}
                <div className="report__card">
                    <h3>💰 Premium Income Trend</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={incomeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="income" stroke="#1565c0" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart 3 — Risk Levels */}
                <div className="report__card">
                    <h3>⚠️ Risk Levels</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={riskData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label
                            >
                                {riskData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart 4 — Claim Frequency */}
                <div className="report__card">
                    <h3>📋 Claim Frequency</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={claimFrequency}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="claims" stroke="#ef5350" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}

export default Reports;
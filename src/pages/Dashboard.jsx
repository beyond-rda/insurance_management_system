import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import "../styles/Dashboard.scss";

// Data for the Bar chart — monthly claims
const claimsData = [
    { month: "Jan", claims: 30 },
    { month: "Feb", claims: 45 },
    { month: "Mar", claims: 28 },
    { month: "Apr", claims: 60 },
    { month: "May", claims: 40 },
    { month: "Jun", claims: 55 },
];

// Data for the Pie chart — policy types
const policyData = [
    { name: "Health", value: 40 },
    { name: "Motor", value: 30 },
    { name: "Property", value: 20 },
    { name: "Life", value: 10 },
];

// Colors for pie chart slices
const COLORS = ["#1565c0", "#42a5f5", "#ef5350", "#66bb6a"];

function Dashboard() {
    return (
        <div className="dashboard">

            <h1 className="dashboard__title">📊 Dashboard</h1>

            {/* Summary Cards */}
            <div className="dashboard__cards">

                <div className="card">
                    <div className="card__icon">📄</div>
                    <div className="card__number">120</div>
                    <div className="card__label">Total Policies</div>
                </div>

                <div className="card">
                    <div className="card__icon">👥</div>
                    <div className="card__number">85</div>
                    <div className="card__label">Total Clients</div>
                </div>

                <div className="card">
                    <div className="card__icon">📋</div>
                    <div className="card__number">34</div>
                    <div className="card__label">Active Claims</div>
                </div>

                <div className="card">
                    <div className="card__icon">💳</div>
                    <div className="card__number">$24,500</div>
                    <div className="card__label">Total Payments</div>
                </div>

            </div>

            {/* Charts */}
            <div className="dashboard__charts">

                {/* Bar Chart — Monthly Claims */}
                <div className="chart__box">
                    <p className="chart__title">📈 Monthly Claims</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={claimsData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="claims" fill="#1565c0" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart — Policy Distribution */}
                <div className="chart__box">
                    <p className="chart__title">🥧 Policy Distribution</p>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={policyData}
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                dataKey="value"
                                label
                            >
                                {policyData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;
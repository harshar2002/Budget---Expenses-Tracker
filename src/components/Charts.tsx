"use client";

import { useMemo } from "react";
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    LineChart, Line
} from "recharts";
import { Expense } from "@/types";
import { format, parseISO } from "date-fns";
import { useTheme } from "next-themes";

const COLORS = ['#6366f1', '#eab308', '#22c55e', '#ef4444', '#f97316', '#a855f7', '#64748b'];

interface ChartsProps {
    expenses: Expense[];
}

export function Charts({ expenses }: ChartsProps) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Data for Category Pie Chart
    const categoryData = useMemo(() => {
        const totals: Record<string, number> = {};
        expenses.forEach((e) => {
            totals[e.category] = (totals[e.category] || 0) + e.amount;
        });
        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [expenses]);

    // Data for Monthly Bar Chart
    const monthlyData = useMemo(() => {
        const totals: Record<string, number> = {};
        expenses.forEach((e) => {
            // Group by month YYYY-MM
            const month = format(parseISO(e.date), "MMM yyyy");
            totals[month] = (totals[month] || 0) + e.amount;
        });

        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            // Simple sort by assuming it's sequential, or better sort by parsing back,
            // but sticking to array order is usually fine if we sort expenses first
            .sort((a, b) => {
                const dateA = new Date(a.name).getTime();
                const dateB = new Date(b.name).getTime();
                return dateA - dateB;
            });
    }, [expenses]);

    // Data for Daily Trend Chart
    const dailyData = useMemo(() => {
        const totals: Record<string, number> = {};
        expenses.forEach((e) => {
            const dateStr = format(parseISO(e.date), "yyyy-MM-dd");
            totals[dateStr] = (totals[dateStr] || 0) + e.amount;
        });

        return Object.keys(totals)
            .sort((a, b) => a.localeCompare(b))
            .map((dateStr) => ({
                name: format(parseISO(dateStr), "dd MMM"),
                value: totals[dateStr],
                dateStr
            }))
            .slice(-14); // Last 14 days
    }, [expenses]);

    if (expenses.length === 0) {
        return (
            <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p>No expense data available to display charts. Add some expenses first!</p>
            </div>
        );
    }

    // Adjust text color based on theme
    const textColor = isDark ? '#94a3b8' : '#64748b'; // slate-400 / slate-500
    const gridColor = isDark ? '#334155' : '#e2e8f0'; // slate-700 / slate-200

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Pie Chart */}
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
                        Expenses by Category
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9',
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        color: isDark ? '#f8fafc' : '#0f172a'
                                    }}
                                />
                                <Legend formatter={(value) => <span style={{ color: textColor }}>{value}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Monthly Bar Chart */}
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
                        Monthly Trend
                    </h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: textColor, fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value}`}
                                    width={60}
                                />
                                <Tooltip
                                    cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9' }}
                                    formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9',
                                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                        color: isDark ? '#f8fafc' : '#0f172a'
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Daily Trend Chart */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
                    Daily Trend (Last 14 Days)
                </h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: textColor, fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: textColor, fontSize: 12 }}
                                tickFormatter={(value) => `₹${value}`}
                                width={60}
                            />
                            <Tooltip
                                cursor={{ stroke: gridColor, strokeWidth: 1 }}
                                formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: isDark ? '1px solid #1e293b' : '1px solid #f1f5f9',
                                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                                    color: isDark ? '#f8fafc' : '#0f172a'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                strokeWidth={3}
                                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4, stroke: isDark ? '#0f172a' : '#ffffff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

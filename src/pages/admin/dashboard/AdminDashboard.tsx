"use client"

import { BreadCrumb } from "primereact/breadcrumb"
import { AdminLayout } from "../../../layouts/admin layouts/AdminLayout"
import type { MenuItem } from "primereact/menuitem"
import { Link } from "react-router-dom"
import { Card } from "primereact/card"
import { Chart } from "primereact/chart"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"
import { ProgressBar } from "primereact/progressbar"
import { useState, useEffect } from "react"

interface DashboardStats {
    totalUsers: number
    totalCourses: number
    totalTests: number
    totalRevenue: number
    monthlyRevenue: number
    activeUsers: number
    completedTests: number
    courseEnrollments: number
}

interface TopCourse {
    id: number
    title: string
    enrollments: number
    revenue: number
    rating: number
    completionRate: number
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 1247,
        totalCourses: 24,
        totalTests: 156,
        totalRevenue: 45680000,
        monthlyRevenue: 8950000,
        activeUsers: 892,
        completedTests: 3421,
        courseEnrollments: 2156,
    })

    const [topCourses] = useState<TopCourse[]>([
        {
            id: 1,
            title: "TOEIC Listening & Reading Complete Course",
            enrollments: 456,
            revenue: 136800000,
            rating: 4.8,
            completionRate: 78,
        },
        {
            id: 2,
            title: "TOEIC Speaking & Writing Mastery",
            enrollments: 324,
            revenue: 97200000,
            rating: 4.6,
            completionRate: 65,
        },
        {
            id: 3,
            title: "TOEIC Vocabulary Builder",
            enrollments: 289,
            revenue: 57800000,
            rating: 4.7,
            completionRate: 82,
        },
    ])

    // Chart data
    const [revenueChartData, setRevenueChartData] = useState({})
    const [userGrowthData, setUserGrowthData] = useState({})
    const [testPerformanceData, setTestPerformanceData] = useState({})

    const home: MenuItem = { icon: "pi pi-home", url: "/admin/dashboard" }
    const itemsBreadCrumb: MenuItem[] = [
        {
            label: "Dashboard",
            template: () => (
                <Link to="/admin/dashboard" style={{ textDecoration: "none" }} className="text-primary font-semibold">
                    Dashboard
                </Link>
            ),
        },
    ]

    useEffect(() => {
        // Revenue Chart Data
        setRevenueChartData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "Revenue (VND)",
                    data: [6500000, 7200000, 8100000, 7800000, 8900000, 9500000],
                    fill: false,
                    borderColor: "#42A5F5",
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                    tension: 0.4,
                },
            ],
        })

        // User Growth Data
        setUserGrowthData({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
                {
                    label: "New Users",
                    data: [65, 89, 123, 156, 178, 201],
                    backgroundColor: "#66BB6A",
                    borderColor: "#4CAF50",
                    borderWidth: 1,
                },
                {
                    label: "Active Users",
                    data: [145, 167, 189, 234, 267, 289],
                    backgroundColor: "#FFA726",
                    borderColor: "#FF9800",
                    borderWidth: 1,
                },
            ],
        })

        // Test Performance Data
        setTestPerformanceData({
            labels: ["0-200", "201-400", "401-600", "601-800", "801-990"],
            datasets: [
                {
                    data: [12, 25, 35, 20, 8],
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                },
            ],
        })
    }, [])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value)
    }

    const ratingTemplate = (rowData: TopCourse) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-star-fill text-yellow-500"></i>
                <span>{rowData.rating}</span>
            </div>
        )
    }

    const completionTemplate = (rowData: TopCourse) => {
        return (
            <div>
                <ProgressBar value={rowData.completionRate} className="mb-1" style={{ height: "6px" }} />
                <small className="text-600">{rowData.completionRate}%</small>
            </div>
        )
    }

    const revenueTemplate = (rowData: TopCourse) => {
        return formatCurrency(rowData.revenue)
    }

    return (
        <AdminLayout tabName="Dashboard">
            <BreadCrumb model={itemsBreadCrumb} home={home} />
            <div className="layout-content">
                {/* Welcome Header */}
                <div className="grid mb-4">
                    <div className="col-12">
                        <Card>
                            <div className="flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-900 mb-2">Welcome back, Admin! 👋</h2>
                                    <p className="text-600 m-0">Here's what's happening with your TOEIC platform today.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button label="Add Course" icon="pi pi-plus" size="small" />
                                    <Button label="Create Test" icon="pi pi-file-edit" size="small" outlined />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="grid mb-4">
                    <div className="col-12 md:col-6 lg:col-3">
                        <Card>
                            <div className="flex align-items-center">
                                <div
                                    className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                    style={{ width: "3rem", height: "3rem" }}
                                >
                                    <i className="pi pi-users text-blue-500 text-xl"></i>
                                </div>
                                <div className="ml-3">
                                    <div className="text-500 font-medium mb-1">Total Users</div>
                                    <div className="text-900 font-bold text-xl">{stats.totalUsers.toLocaleString()}</div>
                                    <div className="text-green-500 text-sm">
                                        <i className="pi pi-arrow-up mr-1"></i>+12% from last month
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3">
                        <Card>
                            <div className="flex align-items-center">
                                <div
                                    className="flex align-items-center justify-content-center bg-green-100 border-round"
                                    style={{ width: "3rem", height: "3rem" }}
                                >
                                    <i className="pi pi-dollar text-green-500 text-xl"></i>
                                </div>
                                <div className="ml-3">
                                    <div className="text-500 font-medium mb-1">Monthly Revenue</div>
                                    <div className="text-900 font-bold text-xl">{formatCurrency(stats.monthlyRevenue)}</div>
                                    <div className="text-green-500 text-sm">
                                        <i className="pi pi-arrow-up mr-1"></i>+8% from last month
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3">
                        <Card>
                            <div className="flex align-items-center">
                                <div
                                    className="flex align-items-center justify-content-center bg-orange-100 border-round"
                                    style={{ width: "3rem", height: "3rem" }}
                                >
                                    <i className="pi pi-book text-orange-500 text-xl"></i>
                                </div>
                                <div className="ml-3">
                                    <div className="text-500 font-medium mb-1">Course Enrollments</div>
                                    <div className="text-900 font-bold text-xl">{stats.courseEnrollments.toLocaleString()}</div>
                                    <div className="text-green-500 text-sm">
                                        <i className="pi pi-arrow-up mr-1"></i>+15% from last month
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3">
                        <Card>
                            <div className="flex align-items-center">
                                <div
                                    className="flex align-items-center justify-content-center bg-purple-100 border-round"
                                    style={{ width: "3rem", height: "3rem" }}
                                >
                                    <i className="pi pi-file-edit text-purple-500 text-xl"></i>
                                </div>
                                <div className="ml-3">
                                    <div className="text-500 font-medium mb-1">Tests Completed</div>
                                    <div className="text-900 font-bold text-xl">{stats.completedTests.toLocaleString()}</div>
                                    <div className="text-green-500 text-sm">
                                        <i className="pi pi-arrow-up mr-1"></i>+22% from last month
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid mb-4">
                    <div className="col-12 lg:col-8">
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="text-xl font-bold">Revenue Trend</h3>
                                <Button label="View Details" size="small" text />
                            </div>
                            <Chart type="line" data={revenueChartData} height="300px" />
                        </Card>
                    </div>

                    <div className="col-12 lg:col-4">
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="text-xl font-bold">Test Score Distribution</h3>
                                <Button icon="pi pi-refresh" size="small" text />
                            </div>
                            <Chart type="doughnut" data={testPerformanceData} height="300px" />
                        </Card>
                    </div>
                </div>

                <div className="grid mb-4">
                    {/* User Growth Chart */}
                    <div className="col-12 lg:col-6">
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="text-xl font-bold">User Growth</h3>
                                <div className="flex gap-2">
                                    <Badge value="New Users" className="bg-green-500" />
                                    <Badge value="Active Users" className="bg-orange-500" />
                                </div>
                            </div>
                            <Chart type="bar" data={userGrowthData} height="250px" />
                        </Card>
                    </div>

                    {/* Top Performing Courses */}
                    <div className="col-12 lg:col-6">
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-3">
                                <h3 className="text-xl font-bold">Top Performing Courses</h3>
                            </div>
                            <DataTable value={topCourses} size="small">
                                <Column field="title" header="Course" style={{ width: "200px" }} />
                                <Column field="enrollments" header="Students" />
                                <Column field="rating" header="Rating" body={ratingTemplate} />
                                <Column field="completionRate" header="Completion" body={completionTemplate} />
                                <Column field="revenue" header="Revenue" body={revenueTemplate} />
                            </DataTable>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard

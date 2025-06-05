import React, { useState, useEffect } from "react"
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
import { useNavigate } from "react-router-dom"
import { AdminDashboardStats } from "../../../types/type"
import { callGetDashboardStats } from "../../../services/admin services/AdminDashboardService"
import { Toast } from "primereact/toast"

const AdminDashboard = () => {
    const navigate = useNavigate()
    const [stats, setStats] = useState<AdminDashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const toast = React.useRef<Toast>(null)

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

    const calculatePercentageChange = (current: number, lastMonth: number): { value: number; isPositive: boolean } => {
        if (lastMonth === 0) return { value: 100, isPositive: true }
        const change = ((current - lastMonth) / lastMonth) * 100
        return { value: Math.abs(Math.round(change)), isPositive: change >= 0 }
    }

    const renderMetricChange = (current: number, lastMonth: number) => {
        const { value, isPositive } = calculatePercentageChange(current, lastMonth)
        const color = isPositive ? "text-green-500" : "text-red-500"
        const icon = isPositive ? "pi pi-arrow-up" : "pi pi-arrow-down"
        
        return (
            <div className={`${color} text-sm`}>
                <i className={`${icon} mr-1`}></i>
                {value}% from last month
            </div>
        )
    }

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true)
                const response = await callGetDashboardStats()
                if (response.data) {
                    setStats(response.data)
                } else {
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to fetch dashboard stats',
                        life: 3000
                    })
                }
            } catch (err) {
                console.error('Error fetching dashboard stats:', err)
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred while fetching dashboard stats',
                    life: 3000
                })
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardStats()
    }, [])

    useEffect(() => {
        if (!stats) return

        // Revenue Chart Data
        setRevenueChartData({
            labels: stats.revenueTrend.labels,
            datasets: [
                {
                    label: "Revenue (VND)",
                    data: stats.revenueTrend.data,
                    fill: false,
                    borderColor: "#42A5F5",
                    backgroundColor: "rgba(66, 165, 245, 0.1)",
                    tension: 0.4,
                },
            ],
        })

        // User Growth Data
        setUserGrowthData({
            labels: stats.userGrowth.labels,
            datasets: [
                {
                    label: "New Users",
                    data: stats.userGrowth.newUsers,
                    backgroundColor: "#66BB6A",
                    borderColor: "#4CAF50",
                    borderWidth: 1,
                },
                {
                    label: "Active Users",
                    data: stats.userGrowth.activeUsers,
                    backgroundColor: "#FFA726",
                    borderColor: "#FF9800",
                    borderWidth: 1,
                },
            ],
        })

        // Test Performance Data
        setTestPerformanceData({
            labels: stats.testScoreDistribution.labels,
            datasets: [
                {
                    data: stats.testScoreDistribution.data,
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                },
            ],
        })
    }, [stats])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value)
    }

    const ratingTemplate = (rowData: AdminDashboardStats['topCourses'][0]) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-star-fill text-yellow-500"></i>
                <span>{rowData.rating.toFixed(1)}</span>
            </div>
        )
    }

    const revenueTemplate = (rowData: AdminDashboardStats['topCourses'][0]) => {
        return formatCurrency(rowData.revenue)
    }

    if (loading) {
        return (
            <AdminLayout tabName="Dashboard">
                <div className="flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                </div>
            </AdminLayout>
        )
    }

    if (!stats) {
        return (
            <AdminLayout tabName="Dashboard">
                <div className="flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                    <div className="text-center">
                        <i className="pi pi-exclamation-triangle text-4xl mb-3" style={{ color: '#FF9800' }}></i>
                        <h2>No Data Available</h2>
                        <p>There is no dashboard data available at the moment.</p>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout tabName="Dashboard">
            <Toast ref={toast} />
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
                                    <Button label="Add Course" icon="pi pi-plus" size="small" onClick={() => navigate("/admin/course")} />
                                    <Button label="Create Test" icon="pi pi-file-edit" size="small" outlined onClick={() => navigate("/admin/test/add")} />
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
                                    {renderMetricChange(stats.totalUsers, stats.lastMonthUsers)}
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
                                    {renderMetricChange(stats.monthlyRevenue, stats.lastMonthRevenue)}
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
                                    <div className="text-500 font-medium mb-1">Course Enrolls</div>
                                    <div className="text-900 font-bold text-xl">{stats.courseEnrollments.toLocaleString()}</div>
                                    {renderMetricChange(stats.courseEnrollments, stats.lastMonthCourseEnrollments)}
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
                                    <div className="text-900 font-bold text-xl">{stats.testAttemps.toLocaleString()}</div>
                                    {renderMetricChange(stats.testAttemps, stats.lastMonthTestAttemps)}
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
                            <DataTable value={stats.topCourses} size="small">
                                <Column field="title" header="Course" style={{ width: "200px" }} />
                                <Column field="enrollments" header="Students" />
                                <Column field="rating" header="Rating" body={ratingTemplate} />
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

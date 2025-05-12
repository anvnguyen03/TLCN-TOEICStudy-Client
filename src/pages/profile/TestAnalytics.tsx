import React, { useState, useEffect } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { Card } from "primereact/card"
import { Chart } from "primereact/chart"
import { ProgressBar } from "primereact/progressbar"
import { Badge } from "primereact/badge"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Divider } from "primereact/divider"

// Mock data for TOEIC analytics
const mockAnalyticsData = {
    currentScore: 785,
    previousScore: 720,
    listeningScore: 395,
    readingScore: 390,
    maxPossibleScore: 990,
    testsTaken: 12,
    averageImprovement: 15,
    strongestPart: "Part 1 - Photographs",
    weakestPart: "Part 7 - Reading Comprehension",
    
    // Enhanced improvement metrics
    improvementStats: {
        totalImprovement: 155, // from first test to current
        monthlyImprovement: 12.5,
        consistentImprovement: true,
        improvementTrend: "upward", // upward, stable, declining
        bestMonth: "April 2024",
        biggestJump: 45,
        currentStreak: 4, // consecutive tests with improvement
        averageTestsPerMonth: 2.4
    },
    
    // Overall performance metrics
    overallStats: {
        totalTestsCompleted: 24,
        totalQuestionsAnswered: 4800,
        averageAccuracy: 78.5,
        totalStudyTime: "156 hours",
        listeningAccuracy: 82.3,
        readingAccuracy: 74.7,
        bestScore: 785,
        averageScore: 695,
        improvementRate: 12.5
    },
    
    // Score history
    scoreHistory: [
        { date: "2024-01", listening: 320, reading: 310, total: 630 },
        { date: "2024-02", listening: 340, reading: 330, total: 670 },
        { date: "2024-03", listening: 365, reading: 355, total: 720 },
        { date: "2024-04", listening: 380, reading: 370, total: 750 },
        { date: "2024-05", listening: 395, reading: 390, total: 785 },
    ],
    
    // Part-wise performance
    partPerformance: [
        { part: "Part 1", name: "Photographs", score: 85, maxScore: 100, accuracy: 85 },
        { part: "Part 2", name: "Question-Response", score: 78, maxScore: 100, accuracy: 78 },
        { part: "Part 3", name: "Conversations", score: 72, maxScore: 100, accuracy: 72 },
        { part: "Part 4", name: "Talks", score: 75, maxScore: 100, accuracy: 75 },
        { part: "Part 5", name: "Incomplete Sentences", score: 80, maxScore: 100, accuracy: 80 },
        { part: "Part 6", name: "Text Completion", score: 70, maxScore: 100, accuracy: 70 },
        { part: "Part 7", name: "Reading Comprehension", score: 68, maxScore: 100, accuracy: 68 },
    ],
    
    // Recent test results with titles
    recentTests: [
        { 
            id: 1, 
            title: "TOEIC Practice Test #15",
            date: "2024-05-15", 
            listening: 395, 
            reading: 390, 
            total: 785, 
            timeToComplete: "118 min" 
        },
        { 
            id: 2, 
            title: "Advanced Reading Comprehension Test",
            date: "2024-04-20", 
            listening: 380, 
            reading: 370, 
            total: 750, 
            timeToComplete: "125 min" 
        },
        { 
            id: 3, 
            title: "TOEIC Listening Focus Test",
            date: "2024-03-25", 
            listening: 365, 
            reading: 355, 
            total: 720, 
            timeToComplete: "115 min" 
        },
        { 
            id: 4, 
            title: "Complete TOEIC Simulation",
            date: "2024-02-28", 
            listening: 340, 
            reading: 330, 
            total: 670, 
            timeToComplete: "130 min" 
        },
    ]
}

const TestAnalytics: React.FC = () => {
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})
    const [partChartData, setPartChartData] = useState({})
    const [selectedPeriod, setSelectedPeriod] = useState({ label: "Last 6 Months", value: "6m" })
    
    const periodOptions = [
        { label: "Last 3 Months", value: "3m" },
        { label: "Last 6 Months", value: "6m" },
        { label: "Last Year", value: "1y" },
        { label: "All Time", value: "all" }
    ]

    useEffect(() => {
        // Score progress chart
        const documentStyle = getComputedStyle(document.documentElement)
        const data = {
            labels: mockAnalyticsData.scoreHistory.map(item => item.date),
            datasets: [
                {
                    label: 'Total Score',
                    data: mockAnalyticsData.scoreHistory.map(item => item.total),
                    fill: false,
                    borderColor: '#2196F3',
                    backgroundColor: '#2196F3',
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Listening',
                    data: mockAnalyticsData.scoreHistory.map(item => item.listening),
                    fill: false,
                    borderColor: '#4CAF50',
                    backgroundColor: '#4CAF50',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Reading',
                    data: mockAnalyticsData.scoreHistory.map(item => item.reading),
                    fill: false,
                    borderColor: '#FF9800',
                    backgroundColor: '#FF9800',
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        }

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    min: 0,
                    max: 500
                }
            }
        }

        // Part performance radar chart
        const partData = {
            labels: mockAnalyticsData.partPerformance.map(item => item.part),
            datasets: [
                {
                    label: 'Your Performance',
                    data: mockAnalyticsData.partPerformance.map(item => item.accuracy),
                    fill: true,
                    backgroundColor: 'rgba(33, 150, 243, 0.2)',
                    borderColor: '#2196F3',
                    pointBackgroundColor: '#2196F3',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#2196F3'
                },
                {
                    label: 'Average Performance',
                    data: [75, 70, 65, 68, 72, 65, 60], // Mock average data
                    fill: true,
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    borderColor: '#FF9800',
                    pointBackgroundColor: '#FF9800',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#FF9800'
                }
            ]
        }

        setChartData(data)
        setChartOptions(options)
        setPartChartData(partData)
    }, [])

    const getScoreLevel = (score: number) => {
        if (score >= 860) return { level: "Advanced", color: "success", description: "Excellent proficiency" }
        if (score >= 730) return { level: "Upper-Intermediate", color: "info", description: "Good proficiency" }
        if (score >= 470) return { level: "Intermediate", color: "warning", description: "Fair proficiency" }
        return { level: "Beginner", color: "danger", description: "Basic proficiency" }
    }

    const currentLevel = getScoreLevel(mockAnalyticsData.currentScore)

    const scoreTemplate = (rowData: any) => {
        const total = rowData.total
        const level = getScoreLevel(total)
        return (
            <div className="flex align-items-center gap-2">
                <span className="font-bold">{total}</span>
                <Badge value={level.level} severity={level.color as any} />
            </div>
        )
    }

    const dateTemplate = (rowData: any) => {
        return new Date(rowData.date).toLocaleDateString()
    }

    const getTrendIcon = (trend: string) => {
        switch(trend) {
            case 'upward': return { icon: 'pi pi-arrow-up', color: 'text-green-500' }
            case 'stable': return { icon: 'pi pi-minus', color: 'text-blue-500' }
            case 'declining': return { icon: 'pi pi-arrow-down', color: 'text-red-500' }
            default: return { icon: 'pi pi-minus', color: 'text-gray-500' }
        }
    }

    const trendIcon = getTrendIcon(mockAnalyticsData.improvementStats.improvementTrend)

    return (
        <UserLayout>
            <div style={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)',
                padding: '20px 0'
            }}>
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2">TOEIC Test Analytics</h1>
                    <p className="text-xl text-white opacity-90">Track your progress and identify areas for improvement</p>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {/* Score Overview Cards */}
                    <div className="grid mb-6">
                        <div className="col-12 md:col-4">
                            <Card className="text-center h-full">
                                <div className="p-4">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {mockAnalyticsData.currentScore}
                                    </div>
                                    <div className="text-sm text-600 mb-2">Best Score</div>
                                    <Badge value={currentLevel.level} severity={currentLevel.color as any} />
                                    <div className="text-xs text-500 mt-1">{currentLevel.description}</div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-4">
                            <Card className="text-center h-full">
                                <div className="p-4">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        +{mockAnalyticsData.improvementStats.totalImprovement}
                                    </div>
                                    <div className="text-sm text-600 mb-2">Total Improvement from first test</div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-4">
                            <Card className="text-center h-full">
                                <div className="p-4">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                                        {mockAnalyticsData.testsTaken}
                                    </div>
                                    <div className="text-sm text-600 mb-2">Tests Completed</div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Overall Performance Statistics */}
                    <Card className="mb-6">
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-4 flex align-items-center gap-2">
                                <i className="pi pi-chart-bar text-blue-500"></i>
                                Overall Performance Statistics
                            </h3>
                            <div className="grid">
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="text-center p-3 border-round bg-blue-50">
                                        <div className="text-2xl font-bold text-blue-600 mb-1">
                                            {mockAnalyticsData.overallStats.totalTestsCompleted}
                                        </div>
                                        <div className="text-sm text-600">Tests Completed</div>
                                        <div className="text-xs text-500 mt-1">
                                            {mockAnalyticsData.overallStats.totalQuestionsAnswered.toLocaleString()} questions answered
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="text-center p-3 border-round bg-green-50">
                                        <div className="text-2xl font-bold text-green-600 mb-1">
                                            {mockAnalyticsData.overallStats.averageAccuracy}%
                                        </div>
                                        <div className="text-sm text-600">Overall Accuracy</div>
                                        <ProgressBar 
                                            value={mockAnalyticsData.overallStats.averageAccuracy} 
                                            style={{ height: '4px' }}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="text-center p-3 border-round bg-orange-50">
                                        <div className="text-2xl font-bold text-orange-600 mb-1">
                                            {mockAnalyticsData.overallStats.averageScore}
                                        </div>
                                        <div className="text-sm text-600">Average Score</div>
                                        <div className="text-xs text-500 mt-1">
                                            Best: {mockAnalyticsData.overallStats.bestScore}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-3">
                                    <div className="text-center p-3 border-round bg-purple-50">
                                        <div className="text-2xl font-bold text-purple-600 mb-1">
                                            {mockAnalyticsData.overallStats.totalStudyTime}
                                        </div>
                                        <div className="text-sm text-600">Study Time</div>
                                        <div className="text-xs text-500 mt-1">
                                            +{mockAnalyticsData.overallStats.improvementRate}% improvement rate
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <Divider />
                            
                            {/* Section Performance Comparison */}
                            <div className="grid">
                                <div className="col-12 md:col-6">
                                    <div className="p-3 border-round bg-gradient-to-r from-blue-50 to-blue-100">
                                        <div className="flex align-items-center justify-content-between mb-3">
                                            <h4 className="text-lg font-bold text-blue-800 m-0 flex align-items-center gap-2">
                                                <i className="pi pi-volume-up"></i>
                                                Listening Performance
                                            </h4>
                                            <Badge 
                                                value={mockAnalyticsData.overallStats.listeningAccuracy >= 80 ? 'Strong' : 'Good'} 
                                                severity={mockAnalyticsData.overallStats.listeningAccuracy >= 80 ? 'success' : 'info'}
                                            />
                                        </div>
                                        <div className="flex align-items-center gap-3 mb-2">
                                            <span className="text-2xl font-bold text-blue-700">
                                                {mockAnalyticsData.overallStats.listeningAccuracy}%
                                            </span>
                                            <div className="flex-1">
                                                <ProgressBar 
                                                    value={mockAnalyticsData.overallStats.listeningAccuracy} 
                                                    style={{ height: '8px' }}
                                                    color="#2196F3"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm text-blue-600">
                                            Average accuracy across all listening tests
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-6">
                                    <div className="p-3 border-round bg-gradient-to-r from-orange-50 to-orange-100">
                                        <div className="flex align-items-center justify-content-between mb-3">
                                            <h4 className="text-lg font-bold text-orange-800 m-0 flex align-items-center gap-2">
                                                <i className="pi pi-book"></i>
                                                Reading Performance
                                            </h4>
                                            <Badge 
                                                value={mockAnalyticsData.overallStats.readingAccuracy >= 80 ? 'Strong' : 'Needs Focus'} 
                                                severity={mockAnalyticsData.overallStats.readingAccuracy >= 80 ? 'success' : 'warning'}
                                            />
                                        </div>
                                        <div className="flex align-items-center gap-3 mb-2">
                                            <span className="text-2xl font-bold text-orange-700">
                                                {mockAnalyticsData.overallStats.readingAccuracy}%
                                            </span>
                                            <div className="flex-1">
                                                <ProgressBar 
                                                    value={mockAnalyticsData.overallStats.readingAccuracy} 
                                                    style={{ height: '8px' }}
                                                    color="#FF9800"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-sm text-orange-600">
                                            Average accuracy across all reading tests
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Charts Section */}
                    <div className="grid mb-6">
                        <div className="col-12 lg:col-8">
                            <Card>
                                <div className="p-4">
                                    <div className="flex align-items-center justify-content-between mb-4">
                                        <h3 className="text-xl font-bold">Score Progress</h3>
                                        <Dropdown 
                                            value={selectedPeriod} 
                                            options={periodOptions} 
                                            onChange={(e) => setSelectedPeriod(e.value)}
                                            optionLabel="label"
                                        />
                                    </div>
                                    <Chart type="line" data={chartData} options={chartOptions} style={{ height: '300px' }} />
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 lg:col-4">
                            <Card className="h-full">
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-4">Part Performance</h3>
                                    <Chart type="radar" data={partChartData} style={{ height: '300px' }} />
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Strengths and Weaknesses */}
                    <div className="grid mb-6">
                        <div className="col-12 md:col-6">
                            <Card className="h-full">
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-4 text-green-600">
                                        <i className="pi pi-check-circle mr-2"></i>
                                        Strongest Area
                                    </h3>
                                    <div className="bg-green-50 p-4 border-round border-left-4 border-green-500">
                                        <div className="font-bold text-green-800 mb-2">
                                            {mockAnalyticsData.strongestPart}
                                        </div>
                                        <div className="text-green-700 text-sm mb-3">
                                            You excel in identifying details in photographs and understanding basic vocabulary.
                                        </div>
                                        <Badge value="85% Accuracy" severity="success" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <div className="col-12 md:col-6">
                            <Card className="h-full">
                                <div className="p-4">
                                    <h3 className="text-xl font-bold mb-4 text-orange-600">
                                        <i className="pi pi-exclamation-triangle mr-2"></i>
                                        Focus Area
                                    </h3>
                                    <div className="bg-orange-50 p-4 border-round border-left-4 border-orange-500">
                                        <div className="font-bold text-orange-800 mb-2">
                                            {mockAnalyticsData.weakestPart}
                                        </div>
                                        <div className="text-orange-700 text-sm mb-3">
                                            Practice reading longer passages and improve time management for complex texts.
                                        </div>
                                        <Badge value="68% Accuracy" severity="warning" />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Part-wise Performance Table */}
                    <Card className="mb-6">
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-4">Detailed Part Analysis</h3>
                            <DataTable value={mockAnalyticsData.partPerformance} responsiveLayout="scroll">
                                <Column field="part" header="Part" />
                                <Column field="name" header="Section Name" />
                                <Column 
                                    field="accuracy" 
                                    header="Accuracy" 
                                    body={(rowData) => (
                                        <div className="flex align-items-center gap-2">
                                            <ProgressBar 
                                                value={rowData.accuracy} 
                                                style={{ width: '100px', height: '6px' }}
                                                color={rowData.accuracy >= 80 ? '#4CAF50' : rowData.accuracy >= 70 ? '#FF9800' : '#F44336'}
                                            />
                                            <span className="font-semibold">{rowData.accuracy}%</span>
                                        </div>
                                    )}
                                />
                                <Column 
                                    field="recommendation" 
                                    header="Status"
                                    body={(rowData) => (
                                        <Badge 
                                            value={rowData.accuracy >= 80 ? 'Strong' : rowData.accuracy >= 70 ? 'Good' : 'Needs Work'}
                                            severity={rowData.accuracy >= 80 ? 'success' : rowData.accuracy >= 70 ? 'info' : 'warning'}
                                        />
                                    )}
                                />
                            </DataTable>
                        </div>
                    </Card>

                    {/* Recent Test Results */}
                    <Card>
                        <div className="p-4">
                            <div className="flex align-items-center justify-content-between mb-4">
                                <h3 className="text-xl font-bold">Recent Test Results</h3>
                                <Button label="View All Results" icon="pi pi-external-link" outlined onClick={() => window.location.href = '/test-history'}/>
                            </div>
                            <DataTable value={mockAnalyticsData.recentTests} responsiveLayout="scroll">
                                <Column field="title" header="Test Title" style={{ minWidth: '200px' }} />
                                <Column field="date" header="Date" body={dateTemplate} />
                                <Column field="listening" header="Listening" />
                                <Column field="reading" header="Reading" />
                                <Column field="total" header="Total Score" body={scoreTemplate} />
                                <Column field="timeToComplete" header="Completion Time" />
                                <Column 
                                    header="Actions"
                                    body={() => (
                                        <Button icon="pi pi-eye" size="small" outlined tooltip="View Details" />
                                    )}
                                />
                            </DataTable>
                        </div>
                    </Card>
                </div>
            </div>
        </UserLayout>
    )
}

export default TestAnalytics
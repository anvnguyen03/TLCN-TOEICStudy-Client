import React, { useEffect, useRef, useState } from "react"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import "./TestHistory.css"
import { useAppSelector } from "../../hooks/reduxHooks"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { ETestMode, ResultHistoryByTest, UserResultDTO } from "../../types/type"
import { Tag } from "primereact/tag"
import { callGetTestHistory } from "../../services/UserService"
import { Toast } from "primereact/toast"
import { Skeleton } from "primereact/skeleton"
import { Card } from "primereact/card"
import { Button } from "primereact/button"
import { Badge } from "primereact/badge"
import { ProgressBar } from "primereact/progressbar"
import { Divider } from "primereact/divider"

const TestHistory: React.FC = () => {
    const fullname = useAppSelector(state => state.auth.fullname)
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [testHistory, setTestHistory] = useState<ResultHistoryByTest[]>()

    // Your existing API integration
    useEffect(() => {
        const fetchTestHistory = async () => {
            setLoading(true)
            try {
                const response = await callGetTestHistory();
                if (response.data) {
                    setTestHistory(response.data)
                }
            } catch (error) {
                console.log(error)
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching data', life: 2000 })
            } finally {
                setLoading(false)
            }
        }
        fetchTestHistory()
    }, [])

    const getSeverity = (status: string) => {
        switch (status) {
            case ETestMode.PRACTICE:
                return 'success'
            case ETestMode.SIMULATION:
                return 'warning'
            default:
                return 'success'
        }
    }

    const getScoreLevel = (score: number) => {
        if (score >= 860) return { level: "Advanced", color: "success" }
        if (score >= 730) return { level: "Upper-Intermediate", color: "info" }
        if (score >= 470) return { level: "Intermediate", color: "warning" }
        return { level: "Beginner", color: "danger" }
    }

    const testModeBodyTemplate = (rowData: UserResultDTO) => {
        return (
            <Tag 
                severity={getSeverity(rowData.testMode)} 
                value={rowData.testMode === ETestMode.PRACTICE ? 'Practice' : 'Simulation'} 
                rounded
                icon={rowData.testMode === ETestMode.PRACTICE ? 'pi pi-play' : 'pi pi-stopwatch'}
            />
        )
    }

    const scoreBodyTemplate = (rowData: UserResultDTO) => {
        const accuracy = Math.round((rowData.correctAnswers / 200) * 100)
        const level = getScoreLevel(rowData.totalScore)
        
        return (
            <div className="flex flex-column gap-2">
                <div className="flex align-items-center gap-2">
                    <span className="font-bold text-lg">{rowData.totalScore}</span>
                    <Badge value={level.level} severity={level.color as any} />
                </div>
                <div className="text-sm text-600">
                    {rowData.correctAnswers}/200 ({accuracy}% accuracy)
                </div>
                <ProgressBar 
                    value={accuracy} 
                    style={{ height: '4px' }}
                    color={accuracy >= 80 ? '#4CAF50' : accuracy >= 60 ? '#FF9800' : '#F44336'}
                />
            </div>
        )
    }

    const completionTimeBodyTemplate = (rowData: UserResultDTO) => {
        const totalMinutes = Math.floor(rowData.completionTime / 60)
        const seconds = rowData.completionTime % 60
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        const timeString = hours > 0 
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${minutes}m ${seconds}s`

        // Calculate efficiency (faster completion = better efficiency)
        const maxTime = 120 * 60 // 120 minutes in seconds
        const efficiency = Math.max(0, Math.round(((maxTime - rowData.completionTime) / maxTime) * 100))

        return (
            <div className="flex flex-column gap-1">
                <span className="font-semibold">{timeString}</span>
                <div className="flex align-items-center gap-2">
                    <span className="text-xs text-600">Efficiency:</span>
                    <Badge 
                        value={`${efficiency}%`} 
                        severity={efficiency >= 70 ? 'success' : efficiency >= 50 ? 'info' : 'warning'}
                    />
                </div>
            </div>
        )
    }

    const dateBodyTemplate = (rowData: UserResultDTO) => {
        const date = new Date(rowData.completedAt)
        const now = new Date()
        const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        
        let timeAgo = ''
        if (diffInDays === 0) timeAgo = 'Today'
        else if (diffInDays === 1) timeAgo = 'Yesterday'
        else if (diffInDays < 7) timeAgo = `${diffInDays} days ago`
        else timeAgo = date.toLocaleDateString()

        return (
            <div className="flex flex-column gap-1">
                <span className="font-semibold">{date.toLocaleDateString()}</span>
                <span className="text-xs text-500">{timeAgo}</span>
            </div>
        )
    }

    const actionBodyTemplate = (rowData: UserResultDTO) => {
        return (
            <Button 
                label="View Details" 
                icon="pi pi-eye"
                size="small"
                outlined
                onClick={() => window.location.href = `/test/${rowData.testId}/results/${rowData.id}`}
            />
        )
    }

    // Calculate overall statistics from API data
    const calculateStats = () => {
        if (!testHistory) return null

        const allResults = testHistory.flatMap(test => test.userResults)
        const totalTests = allResults.length
        const totalScore = allResults.reduce((sum, result) => sum + result.totalScore, 0)
        const averageScore = totalTests > 0 ? Math.round(totalScore / totalTests) : 0
        const bestScore = totalTests > 0 ? Math.max(...allResults.map(r => r.totalScore)) : 0
        const totalCorrect = allResults.reduce((sum, result) => sum + result.correctAnswers, 0)
        const totalQuestions = totalTests * 200
        const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

        return { totalTests, averageScore, bestScore, overallAccuracy }
    }

    const stats = calculateStats()

    return (
        <UserLayout>
            <Toast ref={toast} />
            
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    pointerEvents: 'none'
                }} />
                
                <div className="relative z-1 text-center py-6 px-4">
                    <div className="mb-4">
                        <div 
                            className="inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <i className="pi pi-user text-4xl text-white"></i>
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">
                        TOEIC Test History
                    </h1>
                    <p className="text-xl text-white opacity-90 mb-4">
                        {fullname}'s Learning Journey
                    </p>
                    
                    {/* Stats Overview */}
                    {stats && (
                        <div className="grid max-w-4xl mx-auto">
                            <div className="col-12 md:col-3">
                                <div className="text-center p-3">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.totalTests}</div>
                                    <div className="text-sm text-white opacity-80">Tests Completed</div>
                                </div>
                            </div>
                            <div className="col-12 md:col-3">
                                <div className="text-center p-3">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.bestScore}</div>
                                    <div className="text-sm text-white opacity-80">Best Score</div>
                                </div>
                            </div>
                            <div className="col-12 md:col-3">
                                <div className="text-center p-3">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.averageScore}</div>
                                    <div className="text-sm text-white opacity-80">Average Score</div>
                                </div>
                            </div>
                            <div className="col-12 md:col-3">
                                <div className="text-center p-3">
                                    <div className="text-3xl font-bold text-white mb-1">{stats.overallAccuracy}%</div>
                                    <div className="text-sm text-white opacity-80">Overall Accuracy</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Loading State */}
                {loading && (
                    <div className="grid">
                        {Array(3).fill(0).map((_, index) => (
                            <div className="col-12 mb-4" key={index}>
                                <Card>
                                    <div className="p-4">
                                        <div className="flex align-items-center mb-3">
                                            <Skeleton shape="circle" size="3rem" className="mr-3" />
                                            <div style={{ flex: '1' }}>
                                                <Skeleton width="60%" height="1.5rem" className="mb-2" />
                                                <Skeleton width="40%" height="1rem" />
                                            </div>
                                        </div>
                                        <Skeleton width="100%" height="200px" />
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}

                {/* Test History */}
                {testHistory?.map((test, index) => (
                    <Card className="mb-4" key={index}>
                        <div className="p-4">
                            {/* Test Header */}
                            <div className="flex align-items-center justify-content-between mb-4">
                                <div className="flex align-items-center gap-3">
                                    <div 
                                        className="flex align-items-center justify-content-center"
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '12px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                        }}
                                    >
                                        <i className="pi pi-file-edit text-2xl text-white"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-900 m-0">{test.testTitle}</h3>
                                        <div className="text-sm text-600 mt-1">
                                            {test.userResults.length} attempt{test.userResults.length !== 1 ? 's' : ''} completed
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Test Summary Stats */}
                                <div className="flex gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-blue-600">
                                            {test.userResults.length > 0 ? Math.max(...test.userResults.map(r => r.totalScore)) : 0}
                                        </div>
                                        <div className="text-xs text-600">Best Score</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-green-600">
                                            {test.userResults.length > 0 ? 
                                                Math.round(test.userResults.reduce((sum, r) => sum + (r.correctAnswers / 200 * 100), 0) / test.userResults.length) 
                                                : 0}%
                                        </div>
                                        <div className="text-xs text-600">Avg. Accuracy</div>
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            {/* Results Table */}
                            <div className="mt-4">
                                <DataTable 
                                    value={test.userResults} 
                                    stripedRows 
                                    emptyMessage="No test attempts found"
                                    className="p-datatable-sm"
                                >
                                    <Column 
                                        field="testMode" 
                                        header="Mode" 
                                        body={testModeBodyTemplate}
                                        style={{ minWidth: '120px' }}
                                    />
                                    <Column 
                                        field="completedAt" 
                                        header="Date Completed" 
                                        body={dateBodyTemplate}
                                        style={{ minWidth: '140px' }}
                                    />
                                    <Column 
                                        header="Score & Performance" 
                                        body={scoreBodyTemplate}
                                        style={{ minWidth: '200px' }}
                                    />
                                    <Column 
                                        field="completionTime" 
                                        header="Completion Time" 
                                        body={completionTimeBodyTemplate}
                                        style={{ minWidth: '150px' }}
                                    />
                                    <Column 
                                        header="Actions"
                                        body={actionBodyTemplate}
                                        style={{ minWidth: '120px' }}
                                    />
                                </DataTable>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Empty State */}
                {!loading && testHistory?.length === 0 && (
                    <Card>
                        <div className="text-center py-8">
                            <i className="pi pi-file-edit text-6xl text-400 mb-4"></i>
                            <h3 className="text-2xl font-bold text-700 mb-3">No Test History Found</h3>
                            <p className="text-600 mb-4">
                                You haven't completed any tests yet. Start practicing to see your results here!
                            </p>
                            <Button 
                                label="Browse Tests" 
                                icon="pi pi-arrow-right"
                                onClick={() => window.location.href = '/tests'}
                            />
                        </div>
                    </Card>
                )}
            </div>
        </UserLayout>
    )
}

export default TestHistory
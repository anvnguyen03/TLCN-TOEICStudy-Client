import type React from "react"
import { useState, useEffect, useRef } from "react"
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
import { callGetTestAnalytics } from "../../services/TestAnalyticsService"
import type { TestAnalyticsDTO, AITestAnalysisDTO } from "../../types/type"
import { Toast } from "primereact/toast"
import { TabView, TabPanel } from "primereact/tabview"
import { Tag } from "primereact/tag"
import { callGetLatestAIAnalysis, callRequestAIAnalysis } from "../../services/AIAnalysisService"
import { Skeleton } from "primereact/skeleton"
import { Dialog } from "primereact/dialog"
import "./TestAnalytics.css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

type BadgeSeverity = "success" | "info" | "warning" | "danger" | "secondary" | "contrast"

const TestAnalytics: React.FC = () => {
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})
  const [partChartData, setPartChartData] = useState({})
  const [selectedPeriod, setSelectedPeriod] = useState({ label: "Last 6 Months", value: "6m" })
  const [analyticsData, setAnalyticsData] = useState<TestAnalyticsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<AITestAnalysisDTO | null>(null)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiRequestError, setAiRequestError] = useState<string | null>(null)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const toast = useRef<Toast>(null)

  const periodOptions = [
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last Year", value: "1y" },
    { label: "All Time", value: "all" },
  ]

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)
        const response = await callGetTestAnalytics()
        if (response.data) {
          setAnalyticsData(response.data)
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch analytics data",
            life: 3000,
          })
        }
      } catch (err) {
        console.error("Error fetching analytics data:", err)
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "An error occurred while fetching analytics data",
          life: 3000,
        })
      } finally {
        setLoading(false)
      }
    }

    const fetchLatestAIAnalysis = async () => {
      try {
        const response = await callGetLatestAIAnalysis()
        if (response.data) {
          setAiAnalysis(response.data)
        }
      } catch (err) {
        console.error("Error fetching latest AI analysis:", err)
        // Don't show error toast for this as it's not critical
      }
    }

    fetchAnalyticsData()
    fetchLatestAIAnalysis()
  }, [])

  useEffect(() => {
    if (!analyticsData) return

    // Score progress chart
    const data = {
      labels: analyticsData.scoreHistory.map((item) => item.date),
      datasets: [
        {
          label: "Total Score",
          data: analyticsData.scoreHistory.map((item) => item.total),
          fill: false,
          borderColor: "#2196F3",
          backgroundColor: "#2196F3",
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Listening",
          data: analyticsData.scoreHistory.map((item) => item.listening),
          fill: false,
          borderColor: "#4CAF50",
          backgroundColor: "#4CAF50",
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Reading",
          data: analyticsData.scoreHistory.map((item) => item.reading),
          fill: false,
          borderColor: "#FF9800",
          backgroundColor: "#FF9800",
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }

    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: "#495057",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
        },
        y: {
          ticks: {
            color: "#495057",
          },
          grid: {
            color: "#ebedef",
          },
          min: 0,
          max: 500,
        },
      },
    }

    // Part performance radar chart
    const partData = {
      labels: analyticsData.partPerformance.map((item) => item.part),
      datasets: [
        {
          label: "Your Performance",
          data: analyticsData.partPerformance.map((item) => item.userAccuracy),
          fill: true,
          backgroundColor: "rgba(33, 150, 243, 0.2)",
          borderColor: "#2196F3",
          pointBackgroundColor: "#2196F3",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#2196F3",
        },
        {
          label: "Average Performance",
          data: analyticsData.partPerformance.map((item) => item.avgAccuracy),
          fill: true,
          backgroundColor: "rgba(255, 152, 0, 0.2)",
          borderColor: "#FF9800",
          pointBackgroundColor: "#FF9800",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#FF9800",
        },
      ],
    }

    setChartData(data)
    setChartOptions(options)
    setPartChartData(partData)
  }, [analyticsData])

  const getScoreLevel = (score: number) => {
    if (score >= 860)
      return { level: "Advanced", color: "success" as BadgeSeverity, description: "Excellent proficiency" }
    if (score >= 730)
      return { level: "Upper-Intermediate", color: "info" as BadgeSeverity, description: "Good proficiency" }
    if (score >= 470)
      return { level: "Intermediate", color: "warning" as BadgeSeverity, description: "Fair proficiency" }
    return { level: "Beginner", color: "danger" as BadgeSeverity, description: "Basic proficiency" }
  }

  const requestAIAnalysis = async () => {
    if (!analyticsData) return

    setAiAnalysisLoading(true)
    setAiRequestError(null)

    try {
      const response = await callRequestAIAnalysis(analyticsData)
      if (response.data) {
        setAiAnalysis(response.data)
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: "AI analysis completed successfully",
          life: 3000,
        })
        setShowAiDialog(true)
      }
    } catch (err: any) {
      console.error("Error requesting AI analysis:", err)
      if (err.response && err.response.status === 429) {
        setAiRequestError("You've reached the limit for AI analysis requests. Please try again later.")
      } else {
        setAiRequestError("An error occurred while generating AI analysis. Please try again later.")
      }
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to generate AI analysis",
        life: 3000,
      })
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      </UserLayout>
    )
  }

  if (!analyticsData) {
    return (
      <UserLayout>
        <div className="flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
          <div className="text-center">
            <i className="pi pi-exclamation-triangle text-4xl mb-3" style={{ color: "#FF9800" }}></i>
            <h2>No Data Available</h2>
            <p>There is no analytics data available at the moment.</p>
          </div>
        </div>
      </UserLayout>
    )
  }

  const currentLevel = getScoreLevel(analyticsData.currentScore)

  const scoreTemplate = (rowData: { total: number }) => {
    const total = rowData.total
    const level = getScoreLevel(total)
    return (
      <div className="flex align-items-center gap-2">
        <span className="font-bold">{total}</span>
        <Badge value={level.level} severity={level.color} />
      </div>
    )
  }

  const dateTemplate = (rowData: { date: string }) => {
    return new Date(rowData.date).toLocaleDateString()
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "upward":
        return { icon: "pi pi-arrow-up", color: "text-green-500" }
      case "stable":
        return { icon: "pi pi-minus", color: "text-blue-500" }
      case "declining":
        return { icon: "pi pi-arrow-down", color: "text-red-500" }
      default:
        return { icon: "pi pi-minus", color: "text-gray-500" }
    }
  }

  const trendIcon = getTrendIcon(analyticsData.improvementStats.improvementTrend)

  const renderAIAnalysisContent = () => {
    if (aiAnalysisLoading) {
      return (
        <div className="p-4">
          <div className="flex align-items-center mb-3">
            <Skeleton width="100%" height="2rem" className="mb-2"></Skeleton>
          </div>
          <Skeleton width="100%" height="10rem" className="mb-3"></Skeleton>
          <Skeleton width="100%" height="8rem"></Skeleton>
        </div>
      )
    }

    if (aiRequestError) {
      return (
        <div className="p-4 text-center">
          <i className="pi pi-exclamation-circle text-4xl text-orange-500 mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">AI Analysis Limit Reached</h3>
          <p className="text-600 mb-3">{aiRequestError}</p>
          <Button label="Try Again Later" icon="pi pi-clock" className="p-button-outlined" />
        </div>
      )
    }

    if (!aiAnalysis) {
      return (
        <div className="p-4 text-center">
          <i className="pi pi-info-circle text-4xl text-blue-500 mb-3"></i>
          <h3 className="text-xl font-semibold mb-2">No AI Analysis Available</h3>
          <p className="text-600 mb-3">Get personalized insights and recommendations based on your test performance.</p>
          <Button
            label="Generate AI Analysis"
            icon="fa fa-wand-magic-sparkles"
            className="p-button-primary"
            onClick={requestAIAnalysis}
          />
        </div>
      )
    }

    return (
      <div className="p-4">
        <TabView>
          <TabPanel header="Overview" leftIcon="pi pi-chart-pie mr-2">
            <div className="p-3 border-round bg-blue-50 mb-4">
              <h4 className="text-lg font-bold text-blue-800 mb-2">Overall Feedback</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-blue-700 mb-0">{aiAnalysis.overallFeedback.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="p-3 border-round bg-green-50 h-full">
                  <h4 className="text-lg font-bold text-green-800 mb-2">
                    <i className="pi pi-check-circle mr-2"></i>
                    Strengths
                  </h4>
                  {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 ? (
                    <ul className="list-none p-0 m-0">
                      {aiAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="mb-2 flex align-items-start">
                          <i className="pi pi-check text-green-500 mr-2 mt-1"></i>
                          <span className="text-green-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-600 italic">Keep practicing to develop your strengths!</p>
                  )}
                </div>
              </div>
              <div className="col-12 md:col-6">
                <div className="p-3 border-round bg-orange-50 h-full">
                  <h4 className="text-lg font-bold text-orange-800 mb-2">
                    <i className="pi pi-exclamation-triangle mr-2"></i>
                    Areas to Improve
                  </h4>
                  {aiAnalysis.weaknesses && aiAnalysis.weaknesses.length > 0 ? (
                    <ul className="list-none p-0 m-0">
                      {aiAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="mb-2 flex align-items-start">
                          <i className="pi pi-arrow-right text-orange-500 mr-2 mt-1"></i>
                          <span className="text-orange-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-600 italic">Great job! Keep up the good work!</p>
                  )}
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Detailed Analysis" leftIcon="pi pi-list mr-2">
            <div className="p-3 border-round bg-blue-50 mb-4">
              <h4 className="text-lg font-bold text-blue-800 mb-2">Part Analysis</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-blue-700 mb-0">{aiAnalysis.partAnalysis.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>

            <div className="p-3 border-round bg-purple-50 mb-4">
              <h4 className="text-lg font-bold text-purple-800 mb-2">Skill Analysis</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-purple-700 mb-0">{aiAnalysis.skillAnalysis.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>
          </TabPanel>

          <TabPanel header="Improvement Plan" leftIcon="pi pi-arrow-up mr-2">
            <div className="p-3 border-round bg-green-50 mb-4">
              <h4 className="text-lg font-bold text-green-800 mb-2">Improvement Suggestions</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-green-700 mb-0">{aiAnalysis.improvementSuggestions.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>
          </TabPanel>
        </TabView>

        <div className="flex justify-content-between mt-4">
          <small className="text-500">
            <i className="pi pi-info-circle mr-1"></i>
            AI analysis based on your test history and performance patterns
          </small>
          <Button
            label="Refresh Analysis"
            icon="fa fa-wand-magic-sparkles"
            className="p-button-outlined p-button-sm"
            onClick={requestAIAnalysis}
            loading={aiAnalysisLoading}
          />
        </div>
      </div>
    )
  }

  return (
    <UserLayout>
      <Toast ref={toast} />
      <Dialog
        header="AI Performance Analysis"
        visible={showAiDialog}
        style={{ width: "90vw", maxWidth: "800px" }}
        onHide={() => setShowAiDialog(false)}
        maximizable
      >
        {aiAnalysis && (
          <div className="p-3">
            <div className="p-3 border-round bg-blue-50 mb-4">
              <h4 className="text-lg font-bold text-blue-800 mb-2">Overall Feedback</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-blue-700 mb-0">{aiAnalysis.overallFeedback.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="p-3 border-round bg-green-50 h-full">
                  <h4 className="text-lg font-bold text-green-800 mb-2">
                    <i className="pi pi-check-circle mr-2"></i>
                    Strengths
                  </h4>
                  {aiAnalysis.strengths && aiAnalysis.strengths.length > 0 ? (
                    <ul className="list-none p-0 m-0">
                      {aiAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="mb-2 flex align-items-start">
                          <i className="pi pi-check text-green-500 mr-2 mt-1"></i>
                          <span className="text-green-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-600 italic">Keep practicing to develop your strengths!</p>
                  )}
                </div>
              </div>
              <div className="col-12 md:col-6">
                <div className="p-3 border-round bg-orange-50 h-full">
                  <h4 className="text-lg font-bold text-orange-800 mb-2">
                    <i className="pi pi-exclamation-triangle mr-2"></i>
                    Areas to Improve
                  </h4>
                  {aiAnalysis.weaknesses && aiAnalysis.weaknesses.length > 0 ? (
                    <ul className="list-none p-0 m-0">
                      {aiAnalysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="mb-2 flex align-items-start">
                          <i className="pi pi-arrow-right text-orange-500 mr-2 mt-1"></i>
                          <span className="text-orange-700">{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-600 italic">Great job! Keep up the good work!</p>
                  )}
                </div>
              </div>
            </div>

            <Divider />

            <div className="p-3 border-round bg-blue-50 mb-4">
              <h4 className="text-lg font-bold text-blue-800 mb-2">Part Analysis</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-blue-700 mb-0">{aiAnalysis.partAnalysis.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>

            <div className="p-3 border-round bg-purple-50 mb-4">
              <h4 className="text-lg font-bold text-purple-800 mb-2">Skill Analysis</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-purple-700 mb-0">{aiAnalysis.skillAnalysis.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>

            <div className="p-3 border-round bg-green-50 mb-4">
              <h4 className="text-lg font-bold text-green-800 mb-2">Improvement Suggestions</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown text-green-700 mb-0">{aiAnalysis.improvementSuggestions.replace(/\\n/g, "\n")}</ReactMarkdown>
            </div>
          </div>
        )}
      </Dialog>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4facfe 100%)",
          padding: "20px 0",
        }}
      >
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
                  <div className="text-3xl font-bold text-blue-600 mb-2">{analyticsData.currentScore}</div>
                  <div className="text-sm text-600 mb-2">Latest Score</div>
                  <Badge value={currentLevel.level} severity={currentLevel.color} />
                  <div className="text-xs text-500 mt-1">{currentLevel.description}</div>
                </div>
              </Card>
            </div>
            <div className="col-12 md:col-4">
              <Card className="text-center h-full">
                <div className="p-4">
                  <div className={`text-3xl font-bold ${trendIcon.color} mb-2`}>
                    {analyticsData.improvementStats.totalImprovement}
                  </div>
                  <div className="text-sm text-600 mb-2">Total Improvement from first test</div>
                </div>
                <Badge
                  value={analyticsData.improvementStats.improvementTrend}
                  severity={trendIcon.color as BadgeSeverity}
                />
              </Card>
            </div>
            <div className="col-12 md:col-4">
              <Card className="text-center h-full">
                <div className="p-4">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{analyticsData.testsTaken}</div>
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
                      {analyticsData.overallStats.totalTestsCompleted}
                    </div>
                    <div className="text-sm text-600">Tests Completed</div>
                    <div className="text-xs text-500 mt-1">
                      {analyticsData.overallStats.totalQuestionsAnswered.toLocaleString()} questions answered
                    </div>
                  </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                  <div className="text-center p-3 border-round bg-green-50">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {analyticsData.overallStats.averageAccuracy}%
                    </div>
                    <div className="text-sm text-600">Overall Accuracy</div>
                    <ProgressBar
                      value={analyticsData.overallStats.averageAccuracy}
                      style={{ height: "4px" }}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                  <div className="text-center p-3 border-round bg-orange-50">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {analyticsData.overallStats.averageScore}
                    </div>
                    <div className="text-sm text-600">Average Score</div>
                    <div className="text-xs text-500 mt-1">Best: {analyticsData.overallStats.bestScore}</div>
                  </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                  <div className="text-center p-3 border-round bg-purple-50">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {analyticsData.overallStats.totalStudyTime} Minutes
                    </div>
                    <div className="text-sm text-600">Study Time</div>
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
                        value={analyticsData.overallStats.listeningAccuracy >= 80 ? "Strong" : "Good"}
                        severity={analyticsData.overallStats.listeningAccuracy >= 80 ? "success" : "info"}
                      />
                    </div>
                    <div className="flex align-items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-blue-700">
                        {analyticsData.overallStats.listeningAccuracy}%
                      </span>
                      <div className="flex-1">
                        <ProgressBar
                          value={analyticsData.overallStats.listeningAccuracy}
                          style={{ height: "8px" }}
                          color="#2196F3"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-blue-600">Average accuracy across all listening tests</div>
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
                        value={analyticsData.overallStats.readingAccuracy >= 80 ? "Strong" : "Needs Focus"}
                        severity={analyticsData.overallStats.readingAccuracy >= 80 ? "success" : "warning"}
                      />
                    </div>
                    <div className="flex align-items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-orange-700">
                        {analyticsData.overallStats.readingAccuracy}%
                      </span>
                      <div className="flex-1">
                        <ProgressBar
                          value={analyticsData.overallStats.readingAccuracy}
                          style={{ height: "8px" }}
                          color="#FF9800"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-orange-600">Average accuracy across all reading tests</div>
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
                  <Chart type="line" data={chartData} options={chartOptions} style={{ height: "300px" }} />
                </div>
              </Card>
            </div>
            <div className="col-12 lg:col-4">
              <Card className="h-full">
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-4">Part Performance</h3>
                  <Chart type="radar" data={partChartData} style={{ height: "300px" }} />
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
                    <div className="font-bold text-green-800 mb-2">{analyticsData.strongestPart}</div>
                    <div className="text-green-700 text-sm mb-3">
                      You excel in identifying details in photographs and understanding basic vocabulary.
                    </div>
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
                    <div className="font-bold text-orange-800 mb-2">{analyticsData.weakestPart}</div>
                    <div className="text-orange-700 text-sm mb-3">
                      Practice reading longer passages and improve time management for complex texts.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Part-wise Performance Table */}
          <Card className="mb-6">
            <div className="p-4">
              <h3 className="text-xl font-bold mb-4">Detailed Part Analysis</h3>
              <DataTable value={analyticsData.partPerformance} responsiveLayout="scroll">
                <Column field="part" header="Part" />
                <Column field="name" header="Section Name" />
                <Column
                  field="accuracy"
                  header="Accuracy"
                  body={(rowData) => (
                    <div className="flex align-items-center gap-2">
                      <ProgressBar
                        value={rowData.userAccuracy}
                        style={{ width: "100px", height: "6px" }}
                        color={
                          rowData.userAccuracy >= 80 ? "#4CAF50" : rowData.userAccuracy >= 70 ? "#FF9800" : "#F44336"
                        }
                      />
                      <span className="font-semibold">{rowData.userAccuracy}%</span>
                    </div>
                  )}
                />
                <Column
                  field="recommendation"
                  header="Status"
                  body={(rowData) => (
                    <Badge
                      value={rowData.userAccuracy >= 80 ? "Strong" : rowData.userAccuracy >= 70 ? "Good" : "Needs Work"}
                      severity={
                        rowData.userAccuracy >= 80 ? "success" : rowData.userAccuracy >= 70 ? "info" : "warning"
                      }
                    />
                  )}
                />
              </DataTable>
            </div>
          </Card>

          {/* Recent Test Results */}
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex align-items-center justify-content-between mb-4">
                <h3 className="text-xl font-bold">Recent Test Results</h3>
                <Button
                  label="View All Results"
                  icon="pi pi-external-link"
                  outlined
                  onClick={() => (window.location.href = "/test-history")}
                />
              </div>
              <DataTable value={analyticsData.recentTests} responsiveLayout="scroll">
                <Column field="title" header="Test Title" style={{ minWidth: "200px" }} />
                <Column field="date" header="Date" body={dateTemplate} />
                <Column field="listening" header="Listening" />
                <Column field="reading" header="Reading" />
                <Column field="total" header="Total Score" body={scoreTemplate} />
                <Column
                  field="timeToComplete"
                  header="Completion Time"
                  body={(rowData) => {
                    const minutes = Math.floor(rowData.timeToComplete / 60)
                    const seconds = rowData.timeToComplete % 60
                    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`
                  }}
                />
              </DataTable>
            </div>
          </Card>

          {/* AI Analysis Section */}
          <Card className="mb-6">
            <div className="p-4">
              <div className="flex align-items-center justify-content-between mb-3">
                <h3 className="text-xl font-bold flex align-items-center gap-2">
                  <i className="pi pi-sparkles text-purple-500"></i>
                  <span className="rainbow-text">AI-Powered Performance Analysis</span>
                  <Tag value="NEW" severity="info" className="ml-2" />
                </h3>
                {aiAnalysis && (
                  <Button
                    label="View Full Analysis"
                    icon="pi pi-external-link"
                    className="p-button-outlined"
                    onClick={() => setShowAiDialog(true)}
                  />
                )}
              </div>

              {renderAIAnalysisContent()}
            </div>
          </Card>

        </div>
      </div>
    </UserLayout>
  )
}

export default TestAnalytics

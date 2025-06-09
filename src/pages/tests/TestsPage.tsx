import { Card } from "primereact/card"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"
import "./TestPage.css"
import { Chip } from "primereact/chip"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { useEffect, useRef, useState } from "react"
import { callGetTestInfoPaging } from "../../services/TestService"
import { GetTestInfoPaginRequest, TestCategoryDTO, TestInfoDTO } from "../../types/type"
import { Toast } from "primereact/toast"
import { callGetAllTestCategories } from "../../services/TestCategoryService"
import { formatForUrl } from "../../utils/FormatForUrl"
import { Skeleton } from "primereact/skeleton"

const TestsPage: React.FC = () => {

    const navigate = useNavigate()
    const toast = useRef<Toast>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [first, setFirst] = useState<number>(0)
    const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
    const [rows, setRows] = useState<number>(10)
    const [totalRecords, setTotalRecords] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [tests, setTests] = useState<TestInfoDTO[]>()
    const [categories, setCategories] = useState<TestCategoryDTO[]>()
    const [currentCateId, setCurrentCateId] = useState<number>(-1)

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setCurrentPageIndex(event.page)
        setRows(event.rows)
        fetchTestsInfoPaging(event.page, keyword)
    }

    const handleSearch = () => {
        if (currentCateId === -1) {
            fetchTestsInfoPaging(0, keyword)
        } else {
            fetchTestsInfoPaging(0, keyword, currentCateId)
        }
    }

    const handleAllClick = () => {
        setCurrentCateId(-1)
        setKeyword('')
        setCurrentPageIndex(currentPageIndex)
        fetchTestsInfoPaging(0, '')
        navigate('/tests')
    }

    const handleCategoryClick = (cateId: number) => {
        setCurrentCateId(cateId)
        fetchTestsInfoPaging(0, '', cateId)
    }

    const fetchTestsInfoPaging = async (pageIndex: number, keyword: string, testCategoryId?: number) => {
        try {
            setLoading(true)
            const request: GetTestInfoPaginRequest = {
                page: pageIndex,
                size: rows,
                keyword: keyword,
                testCategoryId: testCategoryId
            }
            const response = await callGetTestInfoPaging(request)
            if (response.data) {
                setTests(response.data.tests)
                setTotalRecords(response.data.totalElements)
            }
        } catch (error) {
            console.log('Error while fetching: ' + error)
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error while fetching data', life: 2000 })
        } finally {
            setLoading(false)
        }
    }

    const handleTestClick = (test: TestInfoDTO) => {
        navigate(`/tests/${test.id}/${formatForUrl(test.title)}`)
    }

    useEffect(() => {
        const fetchAllTestCategories = async () => {
            const response = await callGetAllTestCategories()
            if (response.data) {
                setCategories(response.data)
            }
        }
        fetchAllTestCategories()
    }, [])

    useEffect(() => {
        fetchTestsInfoPaging(currentPageIndex, '')
    }, [])

    // Loading skeleton component
    const TestCardSkeleton = () => (
        <div className="col-12 md:col-6 lg:col-4 xl:col-3 p-2">
            <Card className="h-full">
                <div className="p-3">
                    <Skeleton width="100%" height="1rem" className="mb-2" />
                    <Skeleton width="60%" height="0.8rem" className="mb-2" />
                    <Skeleton width="80%" height="0.8rem" className="mb-2" />
                    <Skeleton width="100%" height="2rem" />
                </div>
            </Card>
        </div>
    )

    // Empty state component
    const EmptyState = () => (
        <div className="col-12 text-center py-8">
            <div className="mb-4">
                <i className="pi pi-search text-6xl text-400"></i>
            </div>
            <h3 className="text-2xl font-bold text-700 mb-3">No Tests Found</h3>
            <p className="text-600 mb-4">
                {keyword ? `No tests match your search "${keyword}"` : 'No tests available at the moment'}
            </p>
            {keyword && (
                <Button
                    label="Clear Search"
                    icon="pi pi-times"
                    className="p-button-outlined"
                    onClick={() => {
                        setKeyword('')
                        handleAllClick()
                    }}
                />
            )}
        </div>
    )

    return (
        <UserLayout>
            <Toast ref={toast} />

            {/* Header Section */}
            <div className="relative mb-6 overflow-hidden border-round-lg">
                <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.9) 0%, rgba(25, 118, 210, 0.8) 100%)',
                        zIndex: 1
                    }}
                />
                <img
                    src="/test_page_background.png"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{ opacity: 0.3 }}
                    alt="Test Library Background"
                />

                <div className="relative z-2 p-6 text-white">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">TOEIC Test Library</h1>
                            <p className="text-xl opacity-90">
                                Practice with our comprehensive collection of TOEIC tests
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-center">
                                <div className="text-3xl font-bold">{totalRecords}</div>
                                <div className="text-sm opacity-80">Available Tests</div>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <Card className="bg-white-alpha-20 border-none">
                        <div className="p-4">
                            <div className="grid align-items-end">
                                <div className="col-12 md:col-8 lg:col-6">
                                    <label htmlFor="keyword" className="block text-white font-semibold mb-2">
                                        <i className="pi pi-search mr-2"></i>
                                        Search Tests
                                    </label>
                                    <div className="p-inputgroup">
                                        <InputText
                                            id="keyword"
                                            placeholder="Enter test name or keyword..."
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                            className="bg-white"
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <Button
                                            icon="pi pi-search"
                                            className="p-button-info"
                                            onClick={handleSearch}
                                            loading={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Filter Categories */}
            <Card className="mb-4">
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-900 mb-3">
                        <i className="pi pi-filter mr-2"></i>
                        Filter by Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            label="All Tests"
                            icon="pi pi-list"
                            rounded
                            raised
                            outlined={currentCateId !== -1}
                            severity={currentCateId === -1 ? "info" : "secondary"}
                            size="small"
                            onClick={handleAllClick}
                        />
                        {categories && categories.map((category, index) => (
                            <Button
                                key={`category-${index}`}
                                label={category.name}
                                rounded
                                raised
                                outlined={currentCateId !== category.id}
                                severity={currentCateId === category.id ? "info" : "secondary"}
                                size="small"
                                onClick={() => handleCategoryClick(category.id)}
                            />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Tests Grid */}
            <div className="grid">
                {loading ? (
                    // Loading skeletons
                    Array.from({ length: 6 }).map((_, index) => (
                        <TestCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : tests && tests.length > 0 ? (
                    tests.map((test, index) => (
                        <div key={index} className="col-12 md:col-6 lg:col-4 xl:col-3 p-2">
                            <Card
                                className="h-full hover:shadow-3 transition-all transition-duration-200 cursor-pointer"
                                onClick={() => handleTestClick(test)}
                            >
                                <div className="p-3">
                                    {/* Test Header - More Compact */}
                                    <div className="mb-2">
                                        <div className="flex align-items-center justify-content-between mb-1">
                                            <h4 className="text-sm font-bold text-900 m-0 line-height-2 flex-1 pr-2">
                                                {test.title}
                                            </h4>
                                            {test.isUserAttemped && (
                                                <i className="pi pi-check-circle text-green-500 text-sm"></i>
                                            )}
                                        </div>
                                        <Chip
                                            label={test.testCategory}
                                            className="bg-blue-50 text-blue-700 text-xs"
                                            style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                                        />
                                    </div>

                                    {/* Compact Stats */}
                                    <div className="flex align-items-center justify-content-between text-xs text-600 mb-2">
                                        <span><i className="pi pi-clock mr-1"></i>{test.duration}min</span>
                                        <span><i className="pi pi-list mr-1"></i>{test.totalQuestions} Questions</span>
                                        <span><i className="pi pi-users mr-1"></i>{test.totalAttemps}</span>
                                    </div>

                                    {/* Action Button - Smaller */}
                                    {test.isUserAttemped ? (
                                        <Button
                                            label="View Results"
                                            icon="pi pi-eye"
                                            severity="success"
                                            outlined
                                            size="small"
                                            className="w-full text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleTestClick(test)
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            label="Start Test"
                                            icon="pi pi-play"
                                            severity="info"
                                            size="small"
                                            className="w-full text-xs"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleTestClick(test)
                                            }}
                                        />
                                    )}
                                </div>
                            </Card>
                        </div>
                    ))
                ) : (
                    <EmptyState />
                )}
            </div>

            {/* Pagination */}
            {tests && tests.length > 0 && (
                <div className="flex justify-content-center mt-6">
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        rowsPerPageOptions={[5, 10, 20, 30]}
                    />
                </div>
            )}
        </UserLayout>
    )
}

export default TestsPage
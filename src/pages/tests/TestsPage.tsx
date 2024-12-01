import { Card } from "primereact/card"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useNavigate, useParams } from "react-router-dom"
import "./TestPage.css"
import { Chip } from "primereact/chip"
import { Divider } from "primereact/divider"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { useEffect, useRef, useState } from "react"
import { callGetTestInfoPaging } from "../../services/TestService"
import { GetTestInfoPaginRequest, TestCategoryDTO, TestInfoDTO } from "../../types/type"
import { Toast } from "primereact/toast"
import { ProgressSpinner } from "primereact/progressspinner"
import { callGetAllTestCategories } from "../../services/TestCategoryService"

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
        fetchTestsInfoPaging(0, keyword, currentCateId)
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

    return (
        <UserLayout>
            <Toast ref={toast} />
            <Card
                className="pt-5 pl-5 mb-3"
                header={<div className="font-bold text-4xl" style={{ paddingLeft: '1.25rem' }}>Thư viện đề thi</div>}
            >
                <label htmlFor="Keyword" className="font-bold text-400">Tìm kiếm đề thi</label>
                <div className="p-inputgroup flex-1 w-6 mt-2 mb-3">
                    <InputText placeholder="Keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                    <Button icon="pi pi-search" outlined raised severity="contrast" className="p-button-info" onClick={() => handleSearch()} />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button label="All" rounded raised outlined={currentCateId !== -1} severity="contrast" size="small" onClick={() => handleAllClick()} />
                    {categories && (categories.map((category, index) => (
                        <Button key={`category-${index}`} label={category.name}
                            rounded raised outlined={currentCateId !== category.id} severity="contrast" size="small"
                            onClick={() => handleCategoryClick(category.id)}
                        />
                    )))}
                </div>
            </Card>
            <div className="flex flex-wrap mb-3" style={{ fontFamily: 'sans-serif' }}>
                {loading && <ProgressSpinner />}
                {tests && tests.length > 0 ? (tests.map((test, index) => (
                    <div key={index} className="col-20 pr-3 pl-3">
                        <div className="testitem-wrapper">
                            <a className="text-900 mb-3" href="" style={{ textDecoration: 'none' }}>
                                <h2 className="mb-1 overflow-hidden" style={{ fontSize: '1rem' }}>
                                    {test.isUserAttemped && (<span className="pi pi-verified text-green-400 mr-1"></span>)}
                                    {test.title}
                                </h2>
                                <div className="testitem-info-wrapper">
                                    <span className="testitem-info">
                                        <span className="pi pi-clock mr-1"></span>
                                        {test.duration} phút |
                                        <span className="pi pi-user-edit mr-1 ml-1"></span>
                                        {test.totalAttemps} |
                                        <span className="pi pi-comments mr-1 ml-1"></span>
                                        {test.totalComments}
                                    </span>
                                    <span className="testitem-info">
                                        {test.totalParts} phần thi | {test.totalQuestions} câu hỏi
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <Chip label={`#${test.testCategory}`} style={{ fontSize: 'small' }} />
                                </div>
                                <Divider />
                            </a>
                            {test.isUserAttemped ? (<div className="testitem-start-test mt-2">
                                <Button label="Xem kết quả" severity="contrast" raised outlined className="w-full" />
                            </div>) : (
                                <Button label="Chi tiết" severity="info" raised outlined className="w-full" />
                            )}
                        </div>
                    </div>))) : (
                    <p>No tests matching keyword</p>
                )
                }
            </div>
            <Paginator first={first} rows={rows} totalRecords={totalRecords} onPageChange={onPageChange} />
        </UserLayout>
    )
}

export default TestsPage
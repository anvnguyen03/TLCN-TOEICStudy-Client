import { Card } from "primereact/card"
import { UserLayout } from "../../layouts/user layouts/Userlayout"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { useNavigate } from "react-router-dom"
import "./TestPage.css"
import { Chip } from "primereact/chip"
import { Divider } from "primereact/divider"
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator"
import { useState } from "react"

const TestsPage: React.FC = () => {

    const navigate = useNavigate()
    const [first, setFirst] = useState<number>(0)
    const [rows, setRows] = useState<number>(10)

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first)
        setRows(event.rows)
    }

    return (
        <UserLayout>
            <Card
                className="pt-5 pl-5 mb-3"
                header={<div className="font-bold text-4xl" style={{ paddingLeft: '1.25rem' }}>Thư viện đề thi</div>}
            >
                <label htmlFor="Keyword" className="font-bold text-400">Tìm kiếm đề thi</label>
                <div className="p-inputgroup flex-1 w-6 mt-2 mb-3">
                    <InputText placeholder="Keyword" />
                    <Button icon="pi pi-search" outlined raised severity="contrast" className="p-button-info" />
                </div>
                <Button label="All" rounded raised outlined severity="contrast" size="small" onClick={() => navigate('/tests')} />
            </Card>
            <div className="flex flex-wrap mb-3" style={{ fontFamily: 'sans-serif' }}>
                {Array(10).fill(0).map((value) => (<div className="col-20 pr-3 pl-3">
                    <div className="testitem-wrapper">
                        <a className="text-900 mb-3" href="" style={{ textDecoration: 'none' }}>
                            <h2 className="mb-1 overflow-hidden" style={{ fontSize: '1rem' }}>
                                <span className="pi pi-verified text-green-400 mr-1"></span>
                                Practice Set TOEIC 2019 Test 1
                            </h2>
                            <div className="testitem-info-wrapper">
                                <span className="testitem-info">
                                    <span className="pi pi-clock mr-1"></span>
                                    120 phút |
                                    <span className="pi pi-user-edit mr-1 ml-1"></span>
                                    10 |
                                    <span className="pi pi-comments mr-1 ml-1"></span>
                                    1000
                                </span>
                                <span className="testitem-info">
                                    7 phần thi | 200 câu hỏi
                                </span>
                            </div>
                            <div className="mt-2">
                                <Chip label="#TOEIC" style={{fontSize: 'small'}} />
                            </div>
                            <Divider />
                        </a>
                        <div className="testitem-start-test mt-2">
                            <Button label="Xem kết quả" severity="contrast" raised outlined className="w-full"/>
                        </div>
                    </div>
                </div>))}
            </div>
            <Paginator first={first} rows={rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange}/>
        </UserLayout>
    )
}

export default TestsPage
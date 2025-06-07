import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const courseId = searchParams.get('courseId');

    const handleReturnToCourse = () => {
        navigate(`/courses/${courseId}`);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-lg rounded-xl shadow-lg p-10 bg-white">
                <div className="flex flex-column align-items-center">
                    <div className="bg-red-100 rounded-full p-4 mb-6 flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                        <i className="pi pi-times text-5xl text-red-500" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Thanh toán thất bại</h1>
                    <div className="text-gray-500 text-lg mb-2 text-center">
                        Đã có lỗi xảy ra trong quá trình thanh toán.
                    </div>
                    <div className="text-gray-500 text-base mb-8 text-center">
                        Vui lòng kiểm tra lại thông tin hoặc thử lại sau. Nếu cần hỗ trợ, hãy liên hệ với chúng tôi.
                    </div>
                    <Button
                        label="Trở lại khóa học"
                        icon="pi pi-arrow-left"
                        onClick={handleReturnToCourse}
                        className="px-6 py-3 text-lg font-semibold rounded-lg bg-cyan-500 border-0 hover:bg-cyan-600 transition-colors"
                        style={{ color: 'white', minWidth: 220 }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default PaymentFailed; 
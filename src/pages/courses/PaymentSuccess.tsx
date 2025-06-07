import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const PaymentSuccess = () => {
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
                    <div className="bg-green-100 rounded-full p-4 mb-6 flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                        <i className="pi pi-check text-5xl text-green-500" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Thanh toán thành công</h1>
                    <div className="text-gray-500 text-lg mb-2 text-center">
                        {/* Thông tin đơn hàng có thể thêm ở đây nếu có */}
                        Cảm ơn bạn đã đăng ký khóa học.
                    </div>
                    <div className="text-gray-500 text-base mb-8 text-center">
                        Bạn có thể bắt đầu học ngay bây giờ hoặc trở lại trang khóa học để xem chi tiết.
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

export default PaymentSuccess; 
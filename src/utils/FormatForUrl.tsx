export const formatForUrl = (text: string): string => {
    // Loại bỏ ký tự không phải chữ, số, hoặc khoảng trắng
    const cleanedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Xóa dấu tiếng Việt
    const withoutSpecialChars = cleanedText.replace(/[^a-zA-Z0-9\s-]/g, "");
    // Thay khoảng trắng bằng dấu '-'
    const formattedText = withoutSpecialChars.trim().toLowerCase().replace(/\s+/g, "-");
    // Trả về chuỗi sau khi xử lý
    return formattedText;
}
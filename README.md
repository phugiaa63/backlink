# backlink

## Cấu hình bổ sung

- `LANDING_PAGE_URL`: URL đích để redirect người dùng thật (bắt buộc)
- `REDIRECT_MIN_DELAY_MS`: Độ trễ tối thiểu (ms) trước khi redirect người dùng thật (mặc định 300)
- `REDIRECT_MAX_DELAY_MS`: Độ trễ tối đa (ms) trước khi redirect người dùng thật (mặc định 500)

## Log

- Mỗi lần redirect hoặc trả HTML cho bot sẽ được ghi vào file `redirect.log` trong thư mục gốc.

## Tối ưu hiệu suất

- File HTML tĩnh được cache vào RAM khi khởi động, tăng tốc phản hồi cho bot.
- Sử dụng thư viện `isbot` để nhận diện bot chính xác hơn.
# VNPay Payment Integration

This project is built with **Next.js** to fulfill the Backend Developer take-home assignment for **Aiicul**.  
It demonstrates backend integration with the **VNPay** payment gateway, simulating a payment flow with sandbox credentials.

---

**Link production:** https://demo-vnpay-phi.vercel.app/

---

## Tech Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** (for UI styling)
- **VNPay Sandbox API**
- **LocalStorage** (to simulate transaction history)

---

## Features

- `/api/payment` POST API to generate VNPay payment links
- Supports optional bank code and custom order info
- Dynamic payment return page with result feedback
- Payment history stored locally (in-browser)
- Environment variable-based config (for both local and production)

---

## API Specification

### `POST /api/payment`

#### Request Body:

```json
{
  "amount": 100000,
  "orderInfo": "Test payment",
  "language": "vn",
  "bankCode": "NCB"
}
```

**Response:**

```json
{
  "url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
  "txnRef": "1751622521357"
}
```

## Local Setup

```json
git clone https://github.com/nhungnguyen-9/vnpay-demo.git
npm install
cp .env.template .env.local
# → Fill in your VNPay credentials
npm run dev
```

Then open: http://localhost:3000

## Environment Variables

Create a .env.local file like this:

```json
VNP_TMN_CODE=YOUR_VNP_TMNCODE
VNP_HASH_SECRET=YOUR_VNP_SECRET
VNP_RETURN_URL= YOUR_VNP_RETURN_URL
```

In production (Vercel), update VNP_RETURN_URL accordingly:

```json
VNP_RETURN_URL=https://your-vercel-app.vercel.app/vnp/payment_return
```

## Design Notes

- VNPay only supports VND in sandbox → removed currency selection.

- No database used, instead demo stores history using localStorage.

- Crypto HMAC SHA512 is applied for vnp_SecureHash as required.

- Parameters are sorted before signing, per VNPay API specs.

- Return page uses useSearchParams() to read and display result.

![Payment Form](public/images/pic1.png)
![Payment](public/images/pic2.png)
![Return URL](public/images/pic3.png)
![Transaction History](public/images/pic4.png)

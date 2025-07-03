import { pad, sortObject } from "@/utils/helpers";
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto'
// @ts-ignore
import qs from 'qs';

export async function POST(req: NextRequest) {
    const body = await req.json()
    const amount = body.amount

    if (!amount || isNaN(amount)) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const vnp_TmnCode = process.env.VNP_TMN_CODE as string | undefined
    const vnp_HashSecret = process.env.VNP_HASH_SECRET as string | undefined

    if (!vnp_TmnCode || !vnp_HashSecret) {
        return NextResponse.json({ error: 'Missing VNPAY configuration' }, { status: 500 })
    }
    const vnp_Url_Sandbox = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'
    const vnp_ReturnUrl = 'http://localhost:3000/vnp/payment_return'

    const date = new Date()
    const createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    const orderId = Date.now().toString()

    let locale = body.language
    if (locale === null || locale === '') {
        locale = 'vn'
    }

    let ipAddr = req.headers.get('x-forwarded-for') || '';

    let vnp_Params: Record<string, string> = {
        vnp_Version: '1.0.0',
        vnp_Command: 'pay',
        vnp_TmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Payment of order ${orderId}`,
        vnp_OrderType: 'other',
        vnp_Amount: (amount * 100).toString(),
        vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = secureHash;

    const paymentUrl = `${vnp_Url_Sandbox}?${qs.stringify(vnp_Params, { encode: true })}`;

    return NextResponse.json({ url: paymentUrl });

}
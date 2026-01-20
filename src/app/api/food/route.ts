import { NextResponse } from 'next/server';

const API_KEY = process.env.FOOD_SAFETY_KEY;
const SERVICE_ID = 'I2790'; // 식품영양성분DB(음식)
const TYPE = 'json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
        return NextResponse.json({ error: 'Server API Key is not configured' }, { status: 500 });
    }

    // MFDS API URL Structure: http://openapi.foodsafetykorea.go.kr/api/keyId/serviceId/dataType/startIdx/endIdx/DESC_KOR=...
    // Fetching first 20 results
    const start = 1;
    const end = 20;
    const url = `http://openapi.foodsafetykorea.go.kr/api/${API_KEY}/${SERVICE_ID}/${TYPE}/${start}/${end}/DESC_KOR=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data[SERVICE_ID] && data[SERVICE_ID].row) {
            return NextResponse.json({ items: data[SERVICE_ID].row });
        } else {
            return NextResponse.json({ items: [] });
        }

    } catch (error) {
        console.error("MFDS API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch from MFDS API' }, { status: 500 });
    }
}

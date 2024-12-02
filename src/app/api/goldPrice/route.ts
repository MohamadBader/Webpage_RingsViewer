import { NextResponse } from 'next/server';
import axios from 'axios';

const API_URL = 'https://financialmodelingprep.com/api/v3/quote/XAUUSD';
const API_KEY =  'HuZyzJPetylG9BmX7CfBDu2E9lH9N0xT';

export async function GET() {
  try {
    // Fetch real-time gold price
    const response = await axios.get(`${API_URL}?apikey=${API_KEY}`);
    const goldPrice = response.data[0].price; // Extract the gold price

    return NextResponse.json({ goldPrice });
  } catch (error) {
    console.error('Error fetching gold price:', error);
    return NextResponse.json({ error: 'Failed to fetch gold price' }, { status: 500 });
  }
}

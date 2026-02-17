// /netlify/functions/get-links.js
import { Client } from 'pg';

export async function handler(event, context) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM links ORDER BY created_at DESC');
    await client.end();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.rows)
    };
  } catch (err) {
    console.error('DB error', err);
    if (client) await client.end().catch(()=>{});
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to load links' })
    };
  }
}

// netlify/functions/get-links.js
const { Client } = require('pg');

exports.handler = async () => {
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT id, title, url, thumbnail, tags, created_at FROM links ORDER BY created_at DESC');
    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
      headers: { 'Content-Type': 'application/json' }
    };
  } catch (err) {
    console.error('DB error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Database error' }) };
  }
};
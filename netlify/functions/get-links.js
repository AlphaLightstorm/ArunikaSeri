// netlify/functions/get-links.js
const { Client } = require('pg');

exports.handler = async () => {
  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(
      'SELECT id, title, url, thumbnail, tags, created_at FROM links ORDER BY created_at DESC'
    );
    await client.end();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res.rows)
    };
  } catch (err) {
    console.error('DB error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Database error' })
    };
  }
};

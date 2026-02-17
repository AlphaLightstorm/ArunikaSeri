// netlify/functions/delete-link.js
const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };

  let payload;
  try { payload = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { id } = payload;
  if (!id) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  try {
    await client.connect();
    await client.query('DELETE FROM links WHERE id = $1', [id]);
    await client.end();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('delete-link error', err);
    try { await client.end(); } catch (_) {}
    return { statusCode: 500, body: JSON.stringify({ error: 'Database delete failed' }) };
  }
};
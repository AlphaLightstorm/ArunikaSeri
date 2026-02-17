// netlify/functions/add-link.js
const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };

  let payload;
  try { payload = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { title, url, thumbnail = null, tags = [] } = payload;
  if (!title || !url) return { statusCode: 400, body: JSON.stringify({ error: 'Missing title or url' }) };

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  try {
    await client.connect();
    const q = `INSERT INTO links (title, url, thumbnail, tags) VALUES ($1, $2, $3, $4) RETURNING id, title, url, thumbnail, tags, clicks, created_at`;
    const values = [title, url, thumbnail, tags];
    const result = await client.query(q, values);
    await client.end();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, link: result.rows[0] }) };
  } catch (err) {
    console.error('add-link error', err);
    try { await client.end(); } catch (_) {}
    return { statusCode: 500, body: JSON.stringify({ error: 'Database insert failed' }) };
  }
};
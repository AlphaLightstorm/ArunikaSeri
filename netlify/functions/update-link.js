// netlify/functions/update-link.js
const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };

  let payload;
  try { payload = JSON.parse(event.body); } catch (e) { return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { id, title, url, thumbnail = null, tags = [] } = payload;
  if (!id || !title || !url) return { statusCode: 400, body: JSON.stringify({ error: 'Missing id, title or url' }) };

  const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });
  try {
    await client.connect();
    const q = `UPDATE links SET title=$1, url=$2, thumbnail=$3, tags=$4 WHERE id=$5 RETURNING id, title, url, thumbnail, tags, clicks, created_at`;
    const values = [title, url, thumbnail, tags, id];
    const result = await client.query(q, values);
    await client.end();
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success: true, link: result.rows[0] }) };
  } catch (err) {
    console.error('update-link error', err);
    try { await client.end(); } catch (_) {}
    return { statusCode: 500, body: JSON.stringify({ error: 'Database update failed' }) };
  }
};
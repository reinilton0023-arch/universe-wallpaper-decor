const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders
  });
}

async function ensureTables(db) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    )
    .run();
}

function cleanList(value) {
  return Array.isArray(value) ? value.filter((item) => item && typeof item.id === "string") : [];
}

export async function onRequestGet({ env }) {
  if (!env.DB) {
    return jsonResponse({ error: "D1 binding DB is not configured." }, 503);
  }

  await ensureTables(env.DB);

  const [clientsResult, jobsResult] = await Promise.all([
    env.DB.prepare("SELECT data FROM clients ORDER BY updated_at DESC").all(),
    env.DB.prepare("SELECT data FROM jobs ORDER BY json_extract(data, '$.date') ASC, json_extract(data, '$.time') ASC").all()
  ]);

  return jsonResponse({
    clients: clientsResult.results.map((row) => JSON.parse(row.data)),
    jobs: jobsResult.results.map((row) => JSON.parse(row.data))
  });
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) {
    return jsonResponse({ error: "D1 binding DB is not configured." }, 503);
  }

  const payload = await request.json();
  const clients = cleanList(payload.clients);
  const jobs = cleanList(payload.jobs);

  await ensureTables(env.DB);

  const statements = [
    env.DB.prepare("DELETE FROM clients"),
    env.DB.prepare("DELETE FROM jobs"),
    ...clients.map((client) =>
      env.DB.prepare("INSERT INTO clients (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)").bind(
        client.id,
        JSON.stringify(client)
      )
    ),
    ...jobs.map((job) =>
      env.DB.prepare("INSERT INTO jobs (id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)").bind(
        job.id,
        JSON.stringify(job)
      )
    )
  ];

  await env.DB.batch(statements);

  return jsonResponse({ ok: true, clients: clients.length, jobs: jobs.length });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: jsonHeaders });
}

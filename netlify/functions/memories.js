const { createClient } = require("@supabase/supabase-js");
const Busboy = require("busboy");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"] || "";

    if (!contentType.includes("multipart/form-data")) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Expected multipart/form-data" }),
      };
    }

    const bb = Busboy({ headers: { "content-type": contentType } });

    const fields = {};
    let fileBuffer = null;
    let fileName = null;
    let fileMime = null;

    const finished = new Promise((resolve, reject) => {
      bb.on("field", (name, val) => (fields[name] = val));

      bb.on("file", (name, file, info) => {
        fileName = info.filename;
        fileMime = info.mimeType;

        const chunks = [];
        file.on("data", (d) => chunks.push(d));
        file.on("end", () => {
          fileBuffer = Buffer.concat(chunks);
        });
      });

      bb.on("finish", resolve);
      bb.on("error", reject);
    });

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body || "", "utf8");

    bb.end(body);
    await finished;

    const name = (fields.name || "").trim();
    const email = (fields.email || "").trim() || null;
    const caption = (fields.caption || "").trim();
    const consent =
      fields.consent === "true" ||
      fields.consent === "on" ||
      String(fields.consent || "").toLowerCase() === "yes";

    if (!name || !caption || !consent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name, caption, and consent are required." }),
      };
    }

    if (!fileBuffer || !fileName) {
      return { statusCode: 400, body: JSON.stringify({ error: "File is required." }) };
    }

    const safeName = fileName.replace(/[^\w.\-]/g, "_");
    const path = `${Date.now()}_${safeName}`;

    const { error: uploadErr } = await supabase.storage
      .from("memories")
      .upload(path, fileBuffer, {
        contentType: fileMime || "application/octet-stream",
      });

    if (uploadErr) {
      return { statusCode: 500, body: JSON.stringify({ error: uploadErr.message }) };
    }

    const { data: publicData } = supabase.storage.from("memories").getPublicUrl(path);
    const file_url = publicData.publicUrl;

    const { error: dbErr } = await supabase.from("memories").insert([
      { name, email, caption, file_url, consent },
    ]);

    if (dbErr) {
      return { statusCode: 500, body: JSON.stringify({ error: dbErr.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, file_url }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";

export const config = {
  path: "/upload",
  method: "POST",
};

export default async (req) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let fileBuffer;
    let fileName = "model.glb";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers });
      }
      fileName = file.name || "model.glb";
      fileBuffer = await file.arrayBuffer();
    } else {
      // Raw binary body
      fileBuffer = await req.arrayBuffer();
      const nameHeader = req.headers.get("x-file-name");
      if (nameHeader) fileName = nameHeader;
    }

    // 40MB hard cap
    if (fileBuffer.byteLength > 40 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "File too large (max 40MB)" }), { status: 413, headers });
    }

    const id = randomUUID();
    const store = getStore({ name: "models", consistency: "strong" });

    await store.set(id, fileBuffer, {
      metadata: {
        fileName,
        uploadedAt: new Date().toISOString(),
        size: fileBuffer.byteLength,
        contentType: "model/gltf-binary",
      },
    });

    return new Response(
      JSON.stringify({ id, fileName, size: fileBuffer.byteLength }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Upload failed" }),
      { status: 500, headers }
    );
  }
};

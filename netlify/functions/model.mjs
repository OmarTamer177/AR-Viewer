import { getStore } from "@netlify/blobs";

export const config = {
  path: "/model/:id",
  method: "GET",
};

export default async (req, context) => {
  const { id } = context.params;

  if (!id) {
    return new Response("Missing model ID", { status: 400 });
  }

  try {
    const store = getStore({ name: "models", consistency: "strong" });
    const result = await store.getWithMetadata(id, { type: "arrayBuffer" });

    if (!result || result.data == null) {
      return new Response("Model not found", { status: 404 });
    }

    return new Response(result.data, {
      status: 200,
      headers: {
        "Content-Type": "model/gltf-binary",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
        "Content-Disposition": `inline; filename="${result.metadata?.fileName || "model.glb"}"`,
      },
    });
  } catch (err) {
    console.error("Serve error:", err);
    return new Response("Error retrieving model: " + err.message, { status: 500 });
  }
};

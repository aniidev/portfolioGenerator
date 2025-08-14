import formidable from "formidable";
import fs from "fs";
import pdf from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(500).json({ error: "File upload error" });
    }

    console.log("Files object:", files);

    let file = files.resume;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded with name 'resume'" });
    }

    // Handle array case
    if (Array.isArray(file)) {
      file = file[0];
    }

    const filePath = file.filepath || file.path;
    if (!filePath) {
      console.log("File object:", file);
      return res.status(400).json({ error: "Uploaded file path not found" });
    }

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const pdfData = await pdf(fileBuffer);

      return res.status(200).json({ text: pdfData.text });
    } catch (error) {
      console.error("PDF parse error:", error);
      return res.status(500).json({ error: "Failed to parse PDF" });
    }
  });
}

if (!globalThis.portfolios) {
  globalThis.portfolios = {};
}

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id, code } = req.body;
    if (!id || !code) {
      return res.status(400).json({ error: "Missing id or code" });
    }
    globalThis.portfolios[id] = code;
    return res.status(200).json({ message: "Portfolio saved" });
  }
  res.status(405).json({ error: "Method not allowed" });
}

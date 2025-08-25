import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const accessToken = session.accessToken;
  const { html } = req.body;

  try {
    // 1. Get GitHub user info
    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });
    const user = await userRes.json();

    // Generate a unique repo name
    const repoName = `portfolio-${Date.now()}`;

    // 2. Create repo
    const repoRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `token ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        name: repoName,
        auto_init: true,
        private: false,
      }),
    });

    if (!repoRes.ok) {
      const error = await repoRes.json();
      throw new Error(error.message || "Repo creation failed");
    }

    // 3. Upload index.html
    await fetch(
      `https://api.github.com/repos/${user.login}/${repoName}/contents/index.html`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Add generated portfolio",
          content: Buffer.from(html).toString("base64"),
        }),
      }
    );

    // 4. Enable GitHub Pages (branch: main, root path)
    await fetch(
      `https://api.github.com/repos/${user.login}/${repoName}/pages`,
      {
        method: "PUT", // use PUT instead of POST
        headers: {
          Authorization: `token ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          source: { branch: "main", path: "/" },
        }),
      }
    );

    const url = `https://${user.login}.github.io/${repoName}`;
    res.status(200).json({ url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, contentType, base64 } = req.body || {};

    if (!fileName || !contentType || !base64) {
      return res.status(400).json({ error: 'Missing image data' });
    }

    if (!String(contentType).startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    const maxSizeBytes = 4 * 1024 * 1024;
    const fileBuffer = Buffer.from(base64, 'base64');
    if (fileBuffer.length > maxSizeBytes) {
      return res.status(413).json({ error: 'Image is too large. Max size is 4MB.' });
    }

    // For local development without GitHub token, use placeholder
    // In production, use GitHub upload
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';
    const siteBaseUrl = process.env.SITE_BASE_URL || 'https://ismora.shop';

    // If GitHub credentials are not available, return placeholder URL
    if (!token || !owner || !repo) {
      // For development, return a fake URL
      const ext = contentType.split('/')[1] || 'jpg';
      const fakeUrl = `https://placehold.co/800x600/f0f0f0/aaa?text=${fileName.replace(/\.[^/.]+$/, '').substring(0, 20)}`;
      return res.status(200).json({ url: fakeUrl, path: 'placeholder' });
    }

    const extensionFromMime = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
      'image/svg+xml': 'svg'
    };

    const originalExt = String(fileName).split('.').pop()?.toLowerCase();
    const safeExt = extensionFromMime[contentType] || originalExt || 'jpg';
    const baseName = String(fileName)
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'blog-image';

    const uniqueName = `${Date.now()}-${baseName}.${safeExt}`;
    const repoPath = `assets/blogs/${uniqueName}`;

    const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        message: `Upload blog image ${uniqueName}`,
        content: base64,
        branch
      })
    });

    const githubData = await githubRes.json().catch(() => ({}));

    if (!githubRes.ok) {
      return res.status(githubRes.status).json({
        error: githubData.message || 'GitHub upload failed'
      });
    }

    const publicUrl = `${String(siteBaseUrl).replace(/\/$/, '')}/assets/blogs/${encodeURIComponent(uniqueName)}`;
    return res.status(200).json({ url: publicUrl, path: repoPath });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
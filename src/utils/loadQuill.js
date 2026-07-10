let quillPromise = null;

export function loadQuill() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.Quill) return Promise.resolve(window.Quill);
  if (quillPromise) return quillPromise;

  quillPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('quill-css')) {
      const link = document.createElement('link');
      link.id = 'quill-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    script.async = true;
    script.onload = () => resolve(window.Quill);
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return quillPromise;
}

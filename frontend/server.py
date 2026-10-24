import http.server
import socketserver
import os
import sys
PORT = 5173
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(DIRECTORY)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def translate_path(self, path):
        # Route /artifacts/ to repository root artifacts directory
        clean_path = path.split('?', 1)[0].split('#', 1)[0]
        if clean_path.startswith('/artifacts/'):
            rel_path = clean_path[len('/artifacts/'):]
            return os.path.join(REPO_ROOT, 'artifacts', rel_path.replace('/', os.sep))
        elif clean_path == '/api/engine-output':
            return os.path.join(REPO_ROOT, 'artifacts', 'engine_output.json')
        return super().translate_path(path)

    def end_headers(self):
        # Prevent caching during live demonstration
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server():
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"[RUNNING] Predictive Circular Grid Dashboard running at:")
        print(f"   Local:   http://localhost:{PORT}")
        print(f"   Directory: {DIRECTORY}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run_server()

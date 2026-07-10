"""Tiny threaded static server for local preview (handles parallel image
requests without blocking, unlike the single-threaded http.server default)."""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

port = int(sys.argv[1]) if len(sys.argv) > 1 else 4612


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching so edits show up immediately during development.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()

    def log_message(self, *args):
        pass


ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()

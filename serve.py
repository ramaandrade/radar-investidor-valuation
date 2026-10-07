#!/usr/bin/env python3
"""
Servidor local rápido para teste do App Web Mobile Fast Page
Passo 6 - Radar do Investidor: Avaliação de Empresas (Valuation)
"""

import http.server
import socketserver
import os
import sys

PORT = 8087

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Desativa cache agressivo em ambiente local de desenvolvimento
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"================================================================")
        print(f"🚀 Radar do Investidor (Valuation) em execução!")
        print(f"📱 Abra no seu navegador móvel ou desktop:")
        print(f"   http://localhost:{PORT}/index.html")
        print(f"   (Pressione Ctrl+C para encerrar)")
        print(f"================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor encerrado com sucesso.")
            sys.exit(0)

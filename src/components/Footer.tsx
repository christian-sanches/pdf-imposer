'use client';

import { Download, Github, Heart } from 'lucide-react';

export function Footer() {
  const githubUrl = "https://github.com/christian-sanches/pdf-imposer";

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              PDF Imposer
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Ferramenta gratuita e de código aberto para organizar e reorganizar páginas de PDF para impressão de livretos. 
              Tudo funciona localmente no seu navegador - seus arquivos nunca saem do seu dispositivo.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recursos
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                100% offline e privado
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                Arraste e solte páginas
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                Layouts A4 e A5
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                Suporte a sangria
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                <Download className="w-3 h-3" />
                Instalável como app
              </li>
            </ul>
          </div>

          {/* Links Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Links
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Código Fonte no GitHub</span>
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                Contribuições são bem-vindas!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
              Feito com <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> para a Pam, pelo Chris.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} PDF Imposer. Código aberto sob licença MIT.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


# 📱 Como Instalar o PDF Imposer como um App

O PDF Imposer pode ser instalado em seu computador ou celular como um aplicativo web progressivo (PWA), permitindo que você o use offline!

## 🖥️ Desktop (Chrome, Edge, Brave)

1. Abra o app no navegador: `https://seu-dominio.com`
2. Procure pelo ícone de instalação na barra de endereços (geralmente um ➕ ou ⬇️)
3. Clique em "Instalar" ou "Adicionar ao Desktop"
4. O app será instalado e você poderá abri-lo como qualquer outro aplicativo

**Atalho de teclado:** Ctrl+Shift+A (Windows/Linux) ou Cmd+Option+A (Mac)

## 📱 Mobile (Android)

### Chrome:
1. Abra o app no Chrome
2. Toque no menu (⋮) no canto superior direito
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme tocando em "Adicionar"

### Firefox:
1. Abra o app no Firefox
2. Toque no ícone de casa com um "+" na barra de endereços
3. Toque em "Adicionar à tela inicial"

## 📱 iOS (iPhone/iPad)

### Safari:
1. Abra o app no Safari
2. Toque no botão "Compartilhar" (🔼)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Confirme tocando em "Adicionar"

**Nota:** O Safari no iOS tem limitações com PWAs, mas a funcionalidade básica funcionará.

## ✅ Verificar Instalação

Depois de instalado, você deverá ver:
- Um ícone do PDF Imposer na sua tela inicial/desktop
- O app abre em uma janela separada (sem barra de endereços do navegador)
- Funciona offline após o primeiro carregamento

## 🔧 Testar Localmente

Para testar o PWA localmente durante o desenvolvimento:

```bash
# 1. Build the production version (service worker is only enabled in production)
npm run build

# 2. Start the production server
npm start

# 3. Open http://localhost:3000 in your browser
# 4. Follow the installation instructions above
```

## 🎨 Ícones e Manifest

Os arquivos necessários para PWA estão em:
- `/public/manifest.json` - Configuração do PWA
- `/public/icon-192.png` - Ícone pequeno
- `/public/icon-512.png` - Ícone grande
- `/public/icon-*.svg` - Versões vetoriais dos ícones

## 🚀 Recursos do PWA

- ✅ **Offline First**: Funciona sem internet após o primeiro carregamento
- ✅ **Instalável**: Pode ser adicionado à tela inicial
- ✅ **Rápido**: Cache agressivo para performance máxima
- ✅ **Privado**: Todos os dados permanecem no seu dispositivo
- ✅ **Multiplataforma**: Funciona em Windows, Mac, Linux, Android e iOS

## 📝 Notas Importantes

1. **HTTPS Requerido**: PWAs só funcionam em HTTPS (exceto localhost)
2. **Service Worker**: Gerado automaticamente durante o build de produção
3. **Cache**: O app cacheia recursos para uso offline
4. **Atualização**: O app se atualiza automaticamente quando você recarrega a página

## 🔗 Links Úteis

- [Documentação PWA da Google](https://web.dev/progressive-web-apps/)
- [Can I Use - PWA](https://caniuse.com/web-app-manifest)
- [Next PWA Documentation](https://ducanh-next-pwa.vercel.app/)


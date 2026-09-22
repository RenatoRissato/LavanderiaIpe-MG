# Lavanderia Ipê — site institucional

Site de página única para a Lavanderia Ipê, lavanderia self-service 24 horas em São Gotardo, MG.
HTML5, CSS3 e JavaScript moderno. Sem framework, sem bundler e sem etapa de build: o `index.html` abre direto no navegador e o mesmo conteúdo é publicado como está.

## Abrir e publicar

- **Local:** abra `index.html` no navegador. Para servir por HTTP (necessário para testar o vídeo e o mapa como em produção), rode `node serve.cjs` e acesse http://127.0.0.1:4173.
- **Vercel:** publique a raiz do projeto. `vercel.json` define cache longo para `/Assets`, cache médio para `/css` e `/js` e cabeçalhos básicos de segurança. `.vercelignore` mantém fora do deploy as ferramentas de desenvolvimento e os materiais de origem.
- Qualquer hospedagem estática serve, desde que preserve maiúsculas e minúsculas nos caminhos.

## Editar as informações do negócio

Tudo o que muda com o tempo está em **`js/config.js`**, no objeto `businessData`:

| Campo | Uso |
| --- | --- |
| `siteUrl` | Domínio oficial, com `https://` e barra final. Ativa canonical, `og:url` e URLs absolutas no JSON-LD. |
| `whatsapp` / `whatsappDisplay` | Número em formato internacional e o número exibido. |
| `address` | Rua, cidade, estado, CEP. Alimenta os links do Maps e o mapa incorporado. |
| `openingHours` | Texto de funcionamento. |
| `instagram` | Perfil oficial. |
| `prices.washPrice` / `prices.dryPrice` | **Preços. Enquanto forem `null`, nenhum valor aparece na página.** |
| `whatsappMessages` | Mensagem inicial do WhatsApp para cada contexto de clique. |

### Adicionar os preços

Troque `null` por números (`16.99`, por exemplo) em `prices`. Os valores são formatados em reais automaticamente e os blocos "Lavagem" e "Secagem" aparecem na seção *Lavar e secar*. Não existe placeholder visível: sem valor confirmado, nada é renderizado.

### Definir o domínio

Preencha `siteUrl`. Como crawlers de redes sociais nem sempre executam JavaScript, ao publicar em definitivo copie também as URLs para o HTML: há um comentário em `index.html` indicando onde fixar `<link rel="canonical">` e `<meta property="og:url">`, e onde trocar `og:image`/`twitter:image` pela URL absoluta.

## Estrutura

```
index.html          página completa, com JSON-LD DryCleaningOrLaundry e sprite de ícones
css/styles.css      design system + componentes + responsivo
js/config.js        businessData: único arquivo a editar no dia a dia
js/main.js          menu, rolagem, revelações, vídeo, mapa sob demanda e dados
vercel.json         cache e cabeçalhos de segurança
Assets/
  fonts/            Manrope variável (latin e latin-ext), auto-hospedada
  images/           imagens do site em WebP e AVIF
  logo/             logo oficial, versão web e favicon
  video/            vídeo original da unidade, versão web do guia e legenda
  *.jpg             artes originais de redes sociais (referência, fora do deploy)
Referencia/         mockup de referência (fora do deploy)
.work/              ferramentas e evidências de desenvolvimento (fora do deploy)
```

## Decisões de implementação

- **Tipografia Manrope auto-hospedada** (dois arquivos, 39 KB no total) com `font-display: swap` e preload do subset latino. Sem requisição a servidores de terceiros.
- **Cores extraídas da logo oficial** (`#0a46b4` e `#5fd119`) e expostas como CSS custom properties, junto de escala tipográfica, espaçamento, raios, sombras, z-index e transições.
- **Ritmo vertical:** `--section-y: clamp(48px, 4.8vw, 76px)` no `padding-block` de cada seção — 96 px entre seções no celular, 138 px em 1440 px e 152 px em 1920 px.
- **Sem GSAP ou qualquer biblioteca.** As animações contínuas (tambor, faixa, pulso) são CSS. O JavaScript controla a rolagem e o percurso entre as seis etapas com `requestAnimationFrame`.
- **Passo a passo sem cards.** Os ícones são conectados por uma linha que avança uma única vez em 4,8 segundos ao entrar na tela. Ela pausa fora da tela ou com a aba oculta; `prefers-reduced-motion` mostra o percurso completo sem movimento. Em telas de até 1000 px, a linha passa a ser vertical.
- **Vantagens em compasso assimétrico.** Grade de 12 colunas: um cartão alto de destaque à esquerda (duas fileiras, fundo azul profundo, "24h" ao fundo em opacidade .075), quatro cartões médios em 4/3 e uma faixa horizontal fechando. As superfícies variam por hierarquia — azul profundo, azul-claro, verde-claro, branco e um gradiente na faixa. Em até 1080 px vira duas colunas com destaque e faixa em largura cheia; em até 580 px, uma coluna, onde os cartões de texto curto passam a ter o ícone ao lado do título.
- **Microinterações da seção:** trilha `Lavar → Secar` que progride ao entrar na tela, ponto verde do monitoramento pulsando duas vezes, chips de sabão e amaciante em stagger, "24h" em fade e escala, brilho radial seguindo o cursor nos três cartões de destaque (só em ponteiro fino) e uma única bolha de fundo respirando em 9 s. A cascata de entrada encadeia a 80 ms por cartão dentro de uma janela de 420 ms, com teto de cinco passos. Tudo desligado por `prefers-reduced-motion`.
- **Revelação progressiva à prova de falhas:** as regras de opacidade só valem quando a classe `js` é aplicada ao `<html>`. Sem JavaScript, ou se `main.js` falhar, todo o conteúdo aparece normalmente.
- **Cartões de vantagens entram por rolagem:** `[data-benefit-reveal]` no cabeçalho e nos seis cartões; o `main.js` aplica `.benefits-ready` e revela cada um em cascata de 80 ms (teto de cinco passos, ordenado pela posição na tela). Sem JavaScript ou com `prefers-reduced-motion`, tudo aparece no estado final.
- **Imagens em AVIF com WebP de reserva**, com `srcset`, `sizes`, dimensões declaradas e `loading="lazy"` em tudo que não é o LCP.
- **Vídeo sob demanda:** nada de vídeo na abertura da página. O `<dialog>` só carrega o arquivo completo de 10 MB ao ser aberto, e o guia embutido em "Primeira vez?" (3 MB, sem áudio) começa a baixar apenas quando a seção entra na tela.
- **Guia tocando na própria seção:** mudo, em laço e com as legendas do vídeo na tela. Pausa sozinho ao sair da viewport e quando o modal abre; espera o toque se houver `prefers-reduced-motion`, economia de dados ou conexão 2G. Sem JavaScript, o vídeo mantém os controles nativos.
- **Mapa sob demanda:** o iframe do Google Maps só é inserido depois do clique. A rota direta no Maps está sempre disponível, sem depender do embed.

## Conteúdo: origem das informações

Todo o conteúdo veio do briefing do cliente ou dos materiais fornecidos. Nada foi inferido.
Os dados abaixo foram lidos nos avisos afixados na unidade, visíveis no vídeo original:

- Máquinas profissionais com capacidade máxima de **10 kg**.
- As máquinas **dosam automaticamente sabão líquido e amaciante concentrado**.
- **Não é permitido** lavar ou secar tapetes e panos de chão, sapatos e tênis, artigos e roupas de pet (pets são bem-vindos na loja).
- **Ambiente monitorado 24 horas.**
- **Tempo médio do ciclo de secagem: 45 minutos**; a orientação da casa é retirar as peças secas a cada 15 minutos e dobrar as roupas ainda quentes.
- Pagamento na **máquina de cartão do totem**, antes de iniciar o ciclo.
- Passo a passo ilustrado em nove etapas, impresso em cada lavadora e secadora.

Não há preços, avaliações, depoimentos, número de clientes, coordenadas, CNPJ nem serviço de coleta e entrega no site — nada disso foi confirmado e nada foi inventado.

## Imagens

- `Assets/images/lavanderia-ipe-*.webp|avif`: quadros reais do vídeo da unidade, em dois tamanhos cada. Os enquadramentos foram escolhidos para excluir as legendas gravadas no vídeo original.
- `lavanderia-ipe-*-destaque-*` e `lavanderia-ipe-dosagem-automatica-*`: artes de campanha da própria marca, nos cartões de lavagem, secagem e produtos inclusos e nos quatro quadros da galeria. São composições ilustrativas, não registros da loja — o `alt` de cada uma diz isso, e o texto de abertura da galeria não promete o contrário. Dois recortes existem para evitar contradição com o texto: o do totem fecha acima da faixa de capacidades (9/14/18 kg contra os "até 10 kg por máquina" do site) e o das instruções fecha no painel.
- `Assets/images/hero-*.webp|avif` e `toalhas.*`: composição preparada a partir do material de divulgação da própria marca, sem inventar o interior da loja.
- `Assets/images/social.jpg`: card de compartilhamento gerado a partir do próprio hero, com a logo oficial.
- `Assets/logo/Logo.png` permanece intacto. `logo-web.webp` e `logo-web.avif` têm fundo transparente: o branco foi recortado por preenchimento a partir das bordas (`.work/gen-logo-transparente.cjs`), preservando os brilhos brancos internos do "i", do "p"/"e" e da gota. As bordas têm a mistura com o branco desfeita, para o logo não ganhar franja clara sobre fundo escuro. Proporções e cores da marca inalteradas.

## Acessibilidade e verificação

- Auditoria axe-core (WCAG 2.0/2.1 A e AA + boas práticas) em 390, 768 e 1440 px: **zero violações automáticas**. Isso não substitui teste manual com leitor de tela.
- Navegação por teclado verificada: link para pular o cabeçalho, foco visível, FAQ nativo em `details`/`summary`, `<dialog>` que fecha com Escape e devolve o foco ao gatilho.
- Layout conferido em 320, 390, 430, 579, 581, 768, 1024, 1180, 1440 e 1920 px, sem rolagem horizontal em nenhum deles.
- Verificado com JavaScript desativado: conteúdo completo, FAQ funcionando e links de WhatsApp com mensagem preenchida.
- `prefers-reduced-motion: reduce` desativa rotações, faixa animada, paralaxe e revelações.
- Medições locais em viewport móvel: LCP ≈ 0,8 s, CLS 0, 12 requisições, ~180 KB na primeira carga.

## Pendências do cliente

1. **Preço da lavagem.**
2. **Preço da secagem.**
3. Domínio definitivo, para fixar canonical e URLs absolutas.
4. Formas de pagamento aceitas hoje (a página confirma apenas o pagamento por cartão no totem e direciona o restante ao WhatsApp).

Enquanto esses dados não chegam, o site funciona normalmente: não exibe valores e encaminha a dúvida de preço para o WhatsApp com mensagem já preenchida.

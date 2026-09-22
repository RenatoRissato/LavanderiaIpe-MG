# 🧺 Lavanderia Ipê — Site Institucional

Site institucional desenvolvido para a **Lavanderia Ipê**, lavanderia self-service 24 horas localizada em **São Gotardo, Minas Gerais**.

O projeto foi criado com foco em uma experiência simples e intuitiva para o cliente, apresentando os serviços da lavanderia, funcionamento das máquinas, localização e canais de contato.

🌐 **Site online:**
https://lavanderia-ipe-mg.vercel.app/

---

## 📸 Sobre o projeto

A proposta foi desenvolver uma presença digital moderna para a Lavanderia Ipê, permitindo que clientes encontrem rapidamente informações importantes sobre o estabelecimento.

O site apresenta:

* funcionamento **24 horas**;
* explicação do processo de lavagem e secagem;
* informações sobre as máquinas;
* produtos utilizados automaticamente durante a lavagem;
* orientações para novos clientes;
* integração com **WhatsApp**;
* localização através do **Google Maps**;
* galeria com materiais da própria marca;
* vídeo demonstrativo da unidade;
* perguntas frequentes.

O conteúdo foi desenvolvido com base nas informações e materiais fornecidos pela própria Lavanderia Ipê.

---

## 🚀 Tecnologias utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge\&logo=html5\&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge\&logo=css3\&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge\&logo=vercel\&logoColor=white)

O projeto utiliza **HTML5, CSS3 e JavaScript puro**, sem frameworks ou bibliotecas externas para as principais funcionalidades.

---

## ✨ Principais recursos

### 📱 Design responsivo

Interface desenvolvida para funcionar corretamente em celulares, tablets e computadores, adaptando a disposição dos elementos de acordo com o tamanho da tela.

### 🧼 Passo a passo interativo

A seção de funcionamento apresenta visualmente o processo utilizado pelo cliente para lavar e secar suas roupas.

### 🎥 Vídeo otimizado

Os vídeos não são carregados desnecessariamente durante a abertura da página. O carregamento acontece somente quando necessário, reduzindo o consumo inicial de dados.

### 🗺️ Integração com Google Maps

O usuário pode visualizar a localização da lavanderia e abrir diretamente uma rota pelo Google Maps.

O mapa incorporado também utiliza carregamento sob demanda.

### 💬 Integração com WhatsApp

Botões espalhados estrategicamente pelo site direcionam o visitante para o WhatsApp da empresa com mensagens pré-configuradas de acordo com o contexto.

### 🖼️ Imagens otimizadas

As imagens utilizam formatos modernos como:

* **AVIF**
* **WebP**

Também são utilizadas técnicas como `srcset`, `sizes` e `loading="lazy"` para reduzir o carregamento desnecessário.

### ♿ Acessibilidade

O projeto possui cuidados como:

* navegação por teclado;
* foco visível;
* link para pular diretamente ao conteúdo;
* FAQ utilizando elementos HTML nativos;
* suporte a `prefers-reduced-motion`;
* modal que pode ser fechado com `Esc`;
* conteúdo acessível mesmo com JavaScript desativado.

---

## 🎨 Identidade visual

A interface foi desenvolvida seguindo a identidade visual da própria Lavanderia Ipê.

Principais cores utilizadas:

```css
--azul-ipe: #0a46b4;
--verde-ipe: #5fd119;
```

A fonte utilizada no projeto é a **Manrope**, hospedada localmente para evitar dependência de serviços externos durante o carregamento.

---

## ⚙️ Configuração do negócio

As principais informações que podem mudar com o tempo ficam centralizadas em:

```text
js/config.js
```

Dentro do objeto:

```javascript
businessData
```

É possível alterar informações como:

```text
URL oficial do site
WhatsApp
Endereço
Horário de funcionamento
Instagram
Preço da lavagem
Preço da secagem
Mensagens automáticas do WhatsApp
```

Dessa forma, dados do estabelecimento podem ser atualizados sem precisar procurar as informações em diversos arquivos do projeto.

---

## 📁 Estrutura do projeto

```text
LavanderiaIpe-MG/
│
├── index.html
├── vercel.json
├── .vercelignore
│
├── css/
│   └── styles.css
│
├── js/
│   ├── config.js
│   └── main.js
│
├── Assets/
│   ├── fonts/
│   ├── images/
│   ├── logo/
│   └── video/
│
└── Referencia/
```

### Principais arquivos

| Arquivo          | Função                                            |
| ---------------- | ------------------------------------------------- |
| `index.html`     | Estrutura principal e conteúdo do site            |
| `css/styles.css` | Layout, componentes, animações e responsividade   |
| `js/config.js`   | Informações configuráveis da lavanderia           |
| `js/main.js`     | Interações, menu, animações, vídeos, mapa e dados |
| `vercel.json`    | Configurações de cache e segurança para a Vercel  |

---

## 💻 Executando localmente

Clone o repositório:

```bash
git clone https://github.com/RenatoRissato/LavanderiaIpe-MG.git
```

Entre na pasta:

```bash
cd LavanderiaIpe-MG
```

Como o projeto não depende de framework ou processo de build, também é possível abrir diretamente:

```text
index.html
```

Para executar através de um servidor local:

```bash
node serve.cjs
```

Depois acesse:

```text
http://127.0.0.1:4173
```

---

## ☁️ Deploy

O site está hospedado na **Vercel**.

🔗 **Produção:**
https://lavanderia-ipe-mg.vercel.app/

O projeto está integrado ao GitHub, permitindo que novas alterações enviadas para o repositório sejam publicadas através do fluxo de deploy da Vercel.

---

## ⚡ Performance

Algumas das estratégias utilizadas no projeto:

* imagens AVIF e WebP;
* lazy loading;
* dimensões de imagens declaradas;
* fontes hospedadas localmente;
* vídeo carregado apenas quando necessário;
* mapa carregado sob demanda;
* ausência de frameworks pesados;
* cache configurado através da Vercel;
* animações feitas principalmente com CSS;
* carregamento progressivo do conteúdo.

---

## 🧪 Testes e verificações

O projeto foi verificado em diferentes resoluções, incluindo telas entre **320 px e 1920 px**.

Também foram realizados testes relacionados a:

* responsividade;
* navegação por teclado;
* execução sem JavaScript;
* redução de movimento;
* ausência de rolagem horizontal;
* acessibilidade automatizada com axe-core.

---

## 🎯 Objetivo do projeto

Além de atender à necessidade real de uma empresa, este projeto faz parte do meu portfólio de desenvolvimento web e demonstra conhecimentos em:

```text
HTML semântico
CSS responsivo
JavaScript
UX/UI
Performance Web
Acessibilidade
SEO
Git/GitHub
Deploy com Vercel
```

---

## 👨‍💻 Desenvolvedor

**Renato Rissato da Silva**

Tecnólogo em **Análise e Desenvolvimento de Sistemas**.

🔗 GitHub:
https://github.com/RenatoRissato

---

⭐ Se gostou do projeto, considere deixar uma estrela no repositório.

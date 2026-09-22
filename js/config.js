/* Dados comerciais da Lavanderia Ipê.
   Este é o único arquivo que precisa ser editado para atualizar informações do negócio.
   Preencha somente com dados oficiais confirmados: campos vazios ou nulos simplesmente
   não aparecem na interface, em vez de exibir placeholders. */
window.businessData = Object.freeze({
  name: 'Lavanderia Ipê',

  /* URL pública oficial, com https:// e barra final.
     Ao preencher, ativa canonical, og:url e URLs absolutas no JSON-LD. */
  siteUrl: '',

  /* Somente dígitos, no formato internacional. */
  whatsapp: '5534999382447',
  whatsappDisplay: '(34) 99938-2447',

  address: {
    street: 'Av. Pref. Erotides Batista, 1335 - Loja 2',
    city: 'São Gotardo',
    state: 'MG',
    postalCode: '38800-000',
    country: 'BR'
  },

  openingHours: {
    label: 'Aberto 24 horas',
    detail: 'Todos os dias'
  },

  instagram: {
    handle: '@lavanderiaipesg',
    url: 'https://www.instagram.com/lavanderiaipesg/'
  },

  /* Valores em reais, como número (ex.: 16.99). Enquanto forem null,
     nenhum preço é renderizado na página — não use zero nem texto. */
  prices: {
    washPrice: null,
    dryPrice: null
  },

  /* Mensagens iniciais do WhatsApp por contexto de clique. */
  whatsappMessages: {
    default: 'Olá! Encontrei a Lavanderia Ipê pelo site e gostaria de tirar uma dúvida.',
    prices: 'Olá! Vi o site da Lavanderia Ipê e gostaria de saber os valores da lavagem e da secagem.',
    firstTime: 'Olá! Vou usar a Lavanderia Ipê pela primeira vez e queria tirar uma dúvida antes de ir.',
    payment: 'Olá! Gostaria de saber quais formas de pagamento a Lavanderia Ipê aceita.',
    location: 'Olá! Estou indo até a Lavanderia Ipê e gostaria de confirmar uma informação.'
  }
});

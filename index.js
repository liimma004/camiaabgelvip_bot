const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// Token do bot (use variável de ambiente)
const token = process.env.TOKEN || '7839054741:AAGZO4sqDXiLPljvHPKk2fzi9niq3wm_48w';

// Domínio onde o bot será hospedado
const domain = 'https://camiaabgelvip-bot.onrender.com';

// Inicializa o bot com webhook
const bot = new TelegramBot(token, { webHook: { port: process.env.PORT || 5000 } });

// Define o URL do webhook
const url = `${domain}/bot${token}`;
bot.setWebHook(url);

// Inicializa o servidor Express
const app = express();
app.use(bodyParser.json());

// Rota para receber as atualizações do Telegram
app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Dados do produto
const productPhoto = 'https://i.postimg.cc/pV5KwYF0/500-X500-Capa.png';
const productDescription = `
Bienvenue dans mon monde 😈 Dans mon VIP vous trouverez :
• Sensuel. •Explicite
• Dim. • Jeux
• Fétiches. •Cosplay🔥
Êtes-vous prêt pour le meilleur contenu auquel vous ne vous êtes jamais abonné ?
😏À bientôt ! Cliquez sur /démarrer💦
• Fellation / orale
• Pénétration anale
• Pénétration vaginale
• Vidéos/photos de chatte
• Vidéos/photos de seins
• Vidéo de masturbation avec Squit
• Vidéos utilisant des accessoires érotiques
Tarifs 👇🏻
Tarif journalier 8 EUR 🇪🇺
Hebdomadaire 16 EUR 🇪🇺
Mensuel 64 EUR 🇪🇺
Dans la vie 250 EUR 🇪🇺
Tarif journalier 8,26 USD🇺🇸
Semaine 16,52 USD 🇺🇸
Mensuel 66,10 USD 🇺🇸
Dans la vie 258,19 USD 🇺🇸
Tarif   30,35 AED🇦🇪
Semaine 60,69 AED 🇦🇪
Mensuel 242,76 AED 🇦🇪
Dans la 948,00 AED 🇦🇪
ACHETEZ ET OBTENEZ UN ACCÈS IMMÉDIAT✅
`;

// Tabela de preços
const prices = {
    EUR: {
        'TARIF JOURNALIER': '8€ EUR',
        'HEBDOMADAIRE': '16€ EUR',
        'MENSUEL': '64€ EUR',
        'DANS LA VIE': '250€ EUR',
    },
    USD: {
        'TARIF JOURNALIER': '8.26 USD',
        'SEMAINE': '16.52 USD',
        'MENSUEL': '66.10 USD',
        'DANS LA VIE': '258.19 USD',
    },
    AED: {
        'TARIF JOURNALIER': '30.35 AED',
        'SEMAINE': '60.69 AED',
        'MENSUEL': '242.76 AED',
        'DANS LA VIE': '948.00 AED',
    },
};

// Métodos de pagamento com dados bancários
const paymentMethods = {
    EUR: {
        IBAN: `
💳 **Coordonnées Bancaires pour EUR 🇪🇺** 💳
• **IBAN**: BE85905272191606
⚠️ **ATTENTION** ⚠️
Vous devez entrer le montant exact de votre achat. Si vous entrez un montant incorrect, vous ne serez pas ajouté au VIP. En cas d'erreur, contactez le support.
`,
    },
    USD: {
        'Swift/BIC': `
💳 **Coordonnées Bancaires pour USD 🇺🇸** 💳
• **Swift/BIC**: TRWIUS35XXX
⚠️ **ATTENTION** ⚠️
Vous devez entrer le montant exact de votre achat. Si vous entrez un montant incorrect, vous ne serez pas ajouté au VIP. En cas d'erreur, contactez le support.
`,
        Deposit: `
💳 **Coordonnées Bancaires pour USD 🇺🇸** 💳
• **Deposit**: 331652012800460
⚠️ **ATTENTION** ⚠️
Vous devez entrer le montant exact de votre achat. Si vous entrez un montant incorrect, vous ne serez pas ajouté au VIP. En cas d'erreur, contactez le support.
`,
        'Routing Number': `
💳 **Coordonnées Bancaires pour USD 🇺🇸** 💳
• **Routing Number**: 084009519
⚠️ **ATTENTION** ⚠️
Vous devez entrer le montant exact de votre achat. Si vous entrez un montant incorrect, vous ne serez pas ajouté au VIP. En cas d'erreur, contactez le support.
`,
    },
    AED: {
        IBAN: `
💳 **Coordonnées Bancaires pour AED 🇦🇪** 💳
• **IBAN**: GB63TRWI23080110420713
⚠️ **ATTENTION** ⚠️
Vous devez entrer le montant exact de votre achat. Si vous entrez un montant incorrect, vous ne serez pas ajouté au VIP. En cas d'erreur, contactez le support.
`,
    },
};

// Estado do usuário
let userState = {};

// Link do Grupo VIP
const groupLink = 'https://t.me/+Y19uFrAjUP0zMzU5'; // Link do grupo VIP

// Comando /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userState[chatId] = {}; // Inicializa o estado do usuário
    console.log(`Comando /start recebido de chatId: ${chatId}`);
    // Envia a foto e a descrição do produto
    bot.sendPhoto(chatId, productPhoto, { caption: productDescription })
        .then(() => {
            // Exibe o teclado inline com a opção "Choisir la Devise"
            bot.sendMessage(chatId, 'Choisissez une option :', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Choisir la Devise', callback_data: 'choose_currency' }],
                    ],
                },
            });
        })
        .catch((err) => {
            console.error('Erreur lors de l\'envoi de la photo :', err);
            bot.sendMessage(chatId, 'Désolé, une erreur s\'est produite lors du chargement de la photo du produit.');
        });
});

// Callback queries
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === 'choose_currency') {
        bot.sendMessage(chatId, 'Choisissez la devise :', {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'EUR 🇪🇺', callback_data: 'currency_EUR' },
                        { text: 'USD 🇺🇸', callback_data: 'currency_USD' },
                        { text: 'AED 🇦🇪', callback_data: 'currency_AED' },
                    ],
                ],
            },
        });
    } else if (data.startsWith('currency_')) {
        const currency = data.split('_')[1]; // Extrai a moeda (EUR, USD, AED)
        userState[chatId].currency = currency;
        // Define o emoji correto para a moeda
        const flag = {
            EUR: '🇪🇺',
            USD: '🇺🇸',
            AED: '🇦🇪',
        }[currency];
        const priceTable = Object.entries(prices[currency])
            .map(([plan, price]) => `• **${plan}** : ${price}`)
            .join('\n');
        const message = `${flag} **PRIX EN ${currency}** ${flag}\n\n${priceTable}`;
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Choisir un Plan', callback_data: 'choose_plan' }],
                    [{ text: 'Retour', callback_data: 'choose_currency' }],
                ],
            },
        });
    } else if (data === 'choose_plan') {
        const currency = userState[chatId].currency;
        // Define o emoji correto para a moeda
        const flag = {
            EUR: '🇪🇺',
            USD: '🇺🇸',
            AED: '🇦🇪',
        }[currency];
        // Cria botões inline para os planos
        const planButtons = Object.keys(prices[currency]).map((plan) => [
            { text: `${plan} ${flag}`, callback_data: `plan_${plan}` },
        ]);
        bot.sendMessage(chatId, `Choisissez le plan ${flag} :`, {
            reply_markup: {
                inline_keyboard: [
                    ...planButtons,
                    [{ text: 'Retour', callback_data: `currency_${currency}` }],
                ],
            },
        });
    } else if (data.startsWith('plan_')) {
        const plan = data.split('_')[1]; // Extrai o plano escolhido
        userState[chatId].plan = plan;
        const currency = userState[chatId].currency;
        const paymentOptions = Object.keys(paymentMethods[currency]).map((method) => [
            { text: method, callback_data: `payment_${method}` },
        ]);
        bot.sendMessage(chatId, 'Choisissez le mode de paiement :', {
            reply_markup: {
                inline_keyboard: [
                    ...paymentOptions,
                    [{ text: 'Retour', callback_data: `plan_${userState[chatId].plan}` }],
                ],
            },
        });
    } else if (data.startsWith('payment_')) {
        const method = data.split('_')[1]; // Extrai o método de pagamento
        const currency = userState[chatId].currency;
        const paymentInstruction = paymentMethods[currency][method];
        bot.sendMessage(chatId, paymentInstruction, { parse_mode: 'Markdown' });
        // Solicita o envio do comprovante de pagamento
        bot.sendMessage(chatId, 'Veuillez envoyer le justificatif de paiement dans le chat.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Retour', callback_data: `plan_${userState[chatId].plan}` }],
                ],
            },
        });
    }
});

// Recebe os comprovantes de pagamento
bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    const currency = userState[chatId].currency;
    const plan = userState[chatId].plan;
    // Confirma a recepção do comprovante
    bot.sendMessage(chatId, 'Justificatif reçu ! Veuillez patienter pendant la confirmation du paiement...');
    // Simulação de confirmação do pagamento
    setTimeout(() => {
        bot.sendMessage(chatId, `✅ Paiement confirmé ! Accès immédiatement libéré.\n\nCliquez sur le lien ci-dessous pour accéder au groupe VIP :\n${groupLink}`);
    }, 3000); // Simula um tempo de verificação
});

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Webhook configurado para: ${url}`);
});

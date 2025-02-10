const TelegramBot = require('node-telegram-bot-api');
const token = '7839054741:AAGZO4sqDXiLPljvHPKk2fzi9niq3wm_48w'; // Remplacez par votre token
const bot = new TelegramBot(token, { polling: true });

// Données du produit
const productPhoto = 'https://i.postimg.cc/pV5KwYF0/500-X500-Capa.png'; // Lien direct de l'image
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

// Tableaux de prix
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

// Méthodes de paiement avec données bancaires
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

// État de l'utilisateur
let userState = {};

// Lien du Groupe VIP
const groupLink = 'https://t.me/+Y19uFrAjUP0zMzU5'; // Lien du groupe VIP

// Commande /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userState[chatId] = {}; // Initialise l'état de l'utilisateur

    // Envoie la photo et la description du produit
    bot.sendPhoto(chatId, productPhoto, { caption: productDescription })
        .then(() => {
            // Affiche le clavier inline avec l'option "Choisir la Devise"
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

// Choix de la devise (clavier inline)
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
        const currency = data.split('_')[1]; // Extrait la devise (EUR, USD, AED)
        userState[chatId].currency = currency;

        // Définit le drapeau correct pour la devise
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

        // Définit le drapeau correct pour la devise
        const flag = {
            EUR: '🇪🇺',
            USD: '🇺🇸',
            AED: '🇦🇪',
        }[currency];

        // Crée des boutons inline pour les plans
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
        const plan = data.split('_')[1]; // Extrait le plan choisi
        userState[chatId].plan = plan;

        const currency = userState[chatId].currency;
        const paymentOptions = Object.keys(paymentMethods[currency]).map((method) => [
            { text: method, callback_data: `payment_${method}` },
        ]);

        bot.sendMessage(chatId, 'Choisissez le mode de paiement :', {
            reply_markup: {
                inline_keyboard: [
                    ...paymentOptions,
                    [{ text: 'Retour', callback_data: 'choose_plan' }],
                ],
            },
        });
    } else if (data.startsWith('payment_')) {
        const method = data.split('_')[1]; // Extrait le mode de paiement
        const currency = userState[chatId].currency;

        const paymentInstruction = paymentMethods[currency][method];

        bot.sendMessage(chatId, paymentInstruction, { parse_mode: 'Markdown' });

        // Demande l'envoi du justificatif de paiement
        bot.sendMessage(chatId, 'Veuillez envoyer le justificatif de paiement dans le chat.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Retour', callback_data: `plan_${userState[chatId].plan}` }],
                ],
            },
        });
    }
});

// Reçoit les justificatifs de paiement
bot.on('document', (msg) => {
    const chatId = msg.chat.id;
    const currency = userState[chatId].currency;
    const plan = userState[chatId].plan;

    // Confirme la réception du justificatif
    bot.sendMessage(chatId, 'Justificatif reçu ! Veuillez patienter pendant la confirmation du paiement...');

    // Simulation de confirmation du paiement
    setTimeout(() => {
        bot.sendMessage(chatId, `✅ Paiement confirmé ! Accès immédiatement libéré.\n\nCliquez sur le lien ci-dessous pour accéder au groupe VIP :\n${groupLink}`);
    }, 3000); // Simule un temps de vérification
});

console.log('Le bot est en cours d\'exécution...');

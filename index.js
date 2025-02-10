const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

// Token do bot (agora vem da variável de ambiente)
const token = process.env.TOKEN; // Substitui o token direto pelo valor da variável de ambiente

// Domínio onde o bot será hospedado
const domain = 'https://camilaangelvipbot.onrender.com';

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

// Restante do código do bot (mantenha o mesmo)
// Dados do produto
const productPhoto = 'https://i.postimg.cc/pV5KwYF0/500-X500-Capa.png';
const productDescription = `
Bienvenue dans mon monde 😈 Dans mon VIP vous trouverez :
• Sensuel. •Explicite
• Dim. • Jeux
• Fétiches. •Cosplay🔥
Êtes-vous prêt pour le meilleur contenu auquel vous ne vous êtes jamais abonné ?
😏À bientôt ! Cliquez sur /démarrer💦
...`; // Continuação do texto original

// Estado do usuário
let userState = {};

// Lógica do bot (comandos, callbacks, etc.)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    userState[chatId] = {};
    bot.sendPhoto(chatId, productPhoto, { caption: productDescription })
        .then(() => {
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

// Callback queries e outras funcionalidades (mantenha o mesmo código)

// Inicia o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Webhook configurado para: ${url}`);
});

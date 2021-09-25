const TelegramApi = require('node-telegram-bot-api');
const token = '1997933840:AAH_S2_fjeWhFzef_5jqsKbbNGeYdCo9zpc';

const {againOptions, gameOptions} = require('./options')

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен будешь его отгадать.');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Поехали!', gameOptions);
}

const bot = new TelegramApi(token, {polling: true})

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Дополнительная Информация'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
           await bot.sendMessage(chatId, 'Привет! Я - простой бот написанный на JS!')
           return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/eb7/80f/eb780f5f-99e7-4005-8c35-898b61b096cd/19.webp');
        }
        if (text === '/info') {
           return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return (bot.sendMessage(chatId, 'Я тебя не понимаю'));
        console.log(msg);
    })
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}! Поздравляю!`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Ты не угадал цифру. Бот загадал число ${chats[chatId]}`, againOptions)
        }
    })
}

start();
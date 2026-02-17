import { NextResponse } from 'next/server';
import { activateSession } from '../../../../lib/loginSessions';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

/**
 * POST /api/telegram/webhook
 *
 * Вебхук для Telegram бота.
 * Telegram присылает сюда все сообщения пользователей.
 *
 * При получении /start login_SESSION_ID:
 * 1. Находит login-сессию
 * 2. Генерирует 6-значный код
 * 3. Отправляет код пользователю в Telegram
 */
export async function POST(request) {
    try {
        const update = await request.json();

        // Обрабатываем только текстовые сообщения
        const message = update.message;
        if (!message || !message.text) {
            return NextResponse.json({ ok: true });
        }

        const chatId = message.chat.id;
        const text = message.text.trim();
        const user = message.from;

        // /start login_SESSION_ID
        if (text.startsWith('/start login_')) {
            const sessionId = text.replace('/start login_', '');
            const result = activateSession(sessionId, {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name || '',
                username: user.username || '',
            });

            if (result) {
                await sendMessage(chatId,
                    `🔐 *Код для входа на StroyMarket:*\n\n` +
                    `\`${result.code}\`\n\n` +
                    `Введите этот код на сайте. Код действителен 5 минут.`
                );
            } else {
                await sendMessage(chatId,
                    `❌ Ссылка для входа устарела или недействительна.\n` +
                    `Попробуйте нажать "Войти через Telegram" ещё раз.`
                );
            }
        }
        // Обычный /start без параметров
        else if (text === '/start') {
            await sendMessage(chatId,
                `👋 Привет, ${user.first_name}!\n\n` +
                `Я бот авторизации *StroyMarket*.\n` +
                `Чтобы войти на сайт, нажмите кнопку "Войти через Telegram" на сайте.`
            );
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[Telegram Webhook] Ошибка:', error);
        return NextResponse.json({ ok: true }); // Всегда 200, иначе TG будет ретраить
    }
}

/**
 * Отправить сообщение через Telegram Bot API
 */
async function sendMessage(chatId, text) {
    if (!BOT_TOKEN || BOT_TOKEN === 'your_bot_token') {
        console.error('[Telegram] BOT_TOKEN не настроен!');
        return;
    }

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown',
            }),
        });
    } catch (err) {
        console.error('[Telegram] Ошибка отправки:', err);
    }
}

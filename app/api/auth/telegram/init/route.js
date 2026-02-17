import { NextResponse } from 'next/server';
import { createSession } from '../../../../../lib/loginSessions';

/**
 * POST /api/auth/telegram/init
 *
 * Создаёт login-сессию и возвращает deep link в бота.
 * Фронтенд открывает этот deep link для пользователя.
 */
export async function POST() {
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;

    if (!botName || botName === 'your_bot_name') {
        return NextResponse.json(
            { success: false, error: 'Telegram бот не настроен' },
            { status: 500 }
        );
    }

    const { sessionId } = createSession();
    const deepLink = `https://t.me/${botName}?start=login_${sessionId}`;

    return NextResponse.json({
        success: true,
        sessionId,
        deepLink,
    });
}

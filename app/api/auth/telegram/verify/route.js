import { NextResponse } from 'next/server';
import { verifySession, getSessionStatus } from '../../../../../lib/loginSessions';

/**
 * POST /api/auth/telegram/verify
 *
 * Проверяет 6-значный код, введённый пользователем.
 * Если код верный — возвращает данные Telegram пользователя.
 */
export async function POST(request) {
    try {
        const { sessionId, code } = await request.json();

        if (!sessionId || !code) {
            return NextResponse.json(
                { success: false, error: 'Не указан sessionId или code' },
                { status: 400 }
            );
        }

        const result = verifySession(sessionId, code.trim());
        return NextResponse.json(result);
    } catch (error) {
        console.error('[TG Verify] Ошибка:', error);
        return NextResponse.json(
            { success: false, error: 'Внутренняя ошибка' },
            { status: 500 }
        );
    }
}

/**
 * GET /api/auth/telegram/verify?sessionId=xxx
 *
 * Поллинг: проверяет, отправил ли бот код (статус code_sent).
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Не указан sessionId' }, { status: 400 });
    }

    const status = getSessionStatus(sessionId);
    if (!status) {
        return NextResponse.json({ status: 'expired' });
    }

    return NextResponse.json(status);
}

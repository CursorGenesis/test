/**
 * In-memory хранилище login-сессий для авторизации через Telegram бота.
 *
 * Сессия живёт 5 минут. После этого автоматически удаляется.
 * Для продакшена заменить на Redis / Supabase / любую БД.
 */

const sessions = new Map();

const SESSION_TTL = 5 * 60 * 1000; // 5 минут

// Генерация 6-значного кода
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Генерация уникального ID сессии
function generateSessionId() {
    return `tg_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}

/**
 * Создать новую login-сессию
 * @returns {{ sessionId: string }}
 */
export function createSession() {
    // Чистим просроченные
    cleanExpired();

    const sessionId = generateSessionId();
    sessions.set(sessionId, {
        id: sessionId,
        status: 'pending',     // pending → code_sent → verified → expired
        code: null,
        telegramId: null,
        telegramName: null,
        telegramUsername: null,
        createdAt: Date.now(),
    });

    return { sessionId };
}

/**
 * Бот получил /start login_XXX — генерируем код и сохраняем данные TG юзера
 * @param {string} sessionId
 * @param {object} telegramUser — { id, first_name, last_name, username }
 * @returns {{ code: string } | null}
 */
export function activateSession(sessionId, telegramUser) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    if (isExpired(session)) {
        sessions.delete(sessionId);
        return null;
    }

    const code = generateCode();
    session.status = 'code_sent';
    session.code = code;
    session.telegramId = telegramUser.id;
    session.telegramName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(' ');
    session.telegramUsername = telegramUser.username || '';

    return { code };
}

/**
 * Проверить код, введённый пользователем
 * @param {string} sessionId
 * @param {string} code
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function verifySession(sessionId, code) {
    const session = sessions.get(sessionId);

    if (!session) {
        return { success: false, error: 'Сессия не найдена' };
    }

    if (isExpired(session)) {
        sessions.delete(sessionId);
        return { success: false, error: 'Код просрочен. Попробуйте ещё раз.' };
    }

    if (session.status !== 'code_sent') {
        return { success: false, error: 'Код ещё не отправлен. Откройте бота в Telegram.' };
    }

    if (session.code !== code) {
        return { success: false, error: 'Неверный код' };
    }

    // Успех!
    session.status = 'verified';
    const user = {
        telegramId: session.telegramId,
        name: session.telegramName,
        username: session.telegramUsername,
    };

    // Удаляем сессию — она больше не нужна
    sessions.delete(sessionId);

    return { success: true, user };
}

/**
 * Получить статус сессии (для поллинга с фронтенда)
 */
export function getSessionStatus(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    if (isExpired(session)) {
        sessions.delete(sessionId);
        return null;
    }
    return { status: session.status };
}

function isExpired(session) {
    return Date.now() - session.createdAt > SESSION_TTL;
}

function cleanExpired() {
    for (const [id, session] of sessions) {
        if (isExpired(session)) {
            sessions.delete(id);
        }
    }
}

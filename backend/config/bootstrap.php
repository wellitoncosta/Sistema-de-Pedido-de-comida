<?php
// ============================================================
// config/bootstrap.php
// Inicialização global: CORS, headers, helpers de resposta
// ============================================================

declare(strict_types=1);

// --- CORS ---
header('Access-Control-Allow-Origin: http://localhost:4200');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- Require Helpers ---
require_once __DIR__ . '/Helpers.php';

// --- Autoload ---
spl_autoload_register(function (string $class): void {
    $dirs = [
        __DIR__ . '/../config/',
        __DIR__ . '/../auth/',
        __DIR__ . '/../models/',
        __DIR__ . '/../api/',
    ];
    foreach ($dirs as $dir) {
        $file = $dir . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// --- Helpers de Resposta JSON ---
function respond(bool $success, string $message, array $data = [], int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit;
}

function respondError(string $message, int $code = 400): void {
    respond(false, $message, [], $code);
}

function respondSuccess(string $message, array $data = []): void {
    respond(true, $message, $data);
}

// --- Body Parser ---
function getBody(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw ?: '{}', true) ?? [];
}

// --- Token JWT simples (HMAC-SHA256) ---
function generateToken(array $payload): string {
    $secret  = 'ISPTEC_SECRET_2026_FOOD_ORDER';
    $header  = base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $body    = base64_encode(json_encode($payload));
    $sig     = base64_encode(hash_hmac('sha256', "$header.$body", $secret, true));
    return "$header.$body.$sig";
}

function verifyToken(string $token): ?array {
    $secret = 'ISPTEC_SECRET_2026_FOOD_ORDER';
    $parts  = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$header, $body, $sig] = $parts;
    $expected = base64_encode(hash_hmac('sha256', "$header.$body", $secret, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(base64_decode($body), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) return null;
    return $payload;
}

function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer (.+)$/', $header, $m)) {
        respondError('Token em falta ou inválido.', 401);
    }
    $payload = verifyToken($m[1]);
    if (!$payload) respondError('Sessão expirada. Por favor, faça login novamente.', 401);
    return $payload;
}

function requireAdmin(): array {
    $payload = requireAuth();
    if ($payload['role'] !== 'admin') respondError('Acesso negado. Requer privilégios de administrador.', 403);
    return $payload;
}
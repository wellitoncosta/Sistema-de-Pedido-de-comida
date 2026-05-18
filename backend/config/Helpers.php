<?php
// ============================================================
// config/Helpers.php
// Funções auxiliares: getBody, requireAuth, requireAdmin, JWT tokens
// ============================================================

declare(strict_types=1);

// --- Recuperar Body JSON ---
function getBody(): array {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// --- Validar e Decodificar JWT ---
function requireAuth(): array {
    $header = getAuthHeader();
    if (!$header) {
        respondError('Token de autenticação obrigatório.', 401);
    }
    
    $token = parseToken($header);
    if (!$token) {
        respondError('Token inválido ou expirado.', 401);
    }
    
    return $token;
}

// --- Validar Permissão Admin ---
function requireAdmin(): array {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        respondError('Acesso negado. Apenas administradores podem aceder.', 403);
    }
    return $user;
}

// --- Extrair Token do Header ---
function getAuthHeader(): ?string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/', $header, $m)) {
        return $m[1];
    }
    return null;
}

// --- Gerar JWT Token ---
function generateToken(array $payload): string {
    $secret = getSecretKey();
    
    $header = json_encode(['alg' => 'HS256', 'typ' => 'JWT'], JSON_UNESCAPED_SLASHES);
    $payload_json = json_encode($payload, JSON_UNESCAPED_SLASHES);
    
    $header_enc  = base64UrlEncode($header);
    $payload_enc = base64UrlEncode($payload_json);
    
    $signature = hash_hmac('sha256', "$header_enc.$payload_enc", $secret, true);
    $signature_enc = base64UrlEncode($signature);
    
    return "$header_enc.$payload_enc.$signature_enc";
}

// --- Decodificar JWT Token ---
function parseToken(string $token): ?array {
    $secret = getSecretKey();
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    
    [$header_enc, $payload_enc, $signature_enc] = $parts;
    
    // Verificar assinatura
    $signature_expected = hash_hmac('sha256', "$header_enc.$payload_enc", $secret, true);
    $signature_expected_enc = base64UrlEncode($signature_expected);
    
    if (!hash_equals($signature_expected_enc, $signature_enc)) {
        return null;
    }
    
    // Decodificar payload
    $payload_json = base64UrlDecode($payload_enc);
    $payload = json_decode($payload_json, true);
    
    if (!$payload || !is_array($payload)) {
        return null;
    }
    
    // Verificar expiração
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }
    
    return $payload;
}

// --- Base64 URL Safe Encoding ---
function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

// --- Base64 URL Safe Decoding ---
function base64UrlDecode(string $data): string {
    $data .= str_repeat('=', 4 - strlen($data) % 4);
    return base64_decode(strtr($data, '-_', '+/'));
}

// --- Obter Chave Secreta para JWT ---
function getSecretKey(): string {
    // Em produção, usar variável de ambiente
    return $_ENV['JWT_SECRET'] ?? 'sua-chave-secreta-muito-segura-mudar-em-producao';
}

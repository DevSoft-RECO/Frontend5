// Genera una cadena aleatoria para el verifier
const generateRandomString = (length: number) => {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
};

// Crea el challenge SHA-256 (Base64 URL Safe)
const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = (a: ArrayBuffer) => {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a) as any))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const preparePKCE = async () => {
    const verifier = generateRandomString(32);
    const challenge = base64urlencode(await sha256(verifier));
    
    // Guardamos en ambos para máxima resiliencia ante redirecciones cross-origin/protocol
    sessionStorage.setItem('pkce_verifier', verifier);
    localStorage.setItem('pkce_verifier', verifier);
    
    return challenge;
};

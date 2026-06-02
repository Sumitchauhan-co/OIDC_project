import fs from 'node:fs';
import path from 'node:path';

const certDir = path.join(process.cwd(), 'cert');

// 1. Ensure the cert directory exists
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir, { recursive: true });
}

// 2. If Railway env variables exist, write them to disk
if (process.env.OIDC_PRIVATE_KEY) {
    fs.writeFileSync(
        path.join(certDir, 'private-key.pem'),
        process.env.OIDC_PRIVATE_KEY.trim(),
    );
    console.log('✅ Private key restored from environment variables.');
}

if (process.env.OIDC_PUBLIC_KEY) {
    fs.writeFileSync(
        path.join(certDir, 'public-key.pub'),
        process.env.OIDC_PUBLIC_KEY.trim(),
    );
    console.log('✅ Public key restored from environment variables.');
}

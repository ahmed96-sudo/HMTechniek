/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'primary.jwwb.nl',
            port: '',
            pathname: '/public/**',
        },
        ],
    },
    /* experimental: {
        missingSuspenseWithCSRBailout: false,
    }, */
}

module.exports = nextConfig

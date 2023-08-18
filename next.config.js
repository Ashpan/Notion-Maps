/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://api.notion.com/v1/:path*',
            },
        ]
    }
}

module.exports = nextConfig

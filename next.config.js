module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/api/:path*', // Let op de nieuwe poort: 5001
      },
    ]
  },
}
const nextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL
          ? `${process.env.API_URL}/api/:path*`
          : "http://localhost:3000/api/:path*",
      },
    ];
  },
};

export default nextConfig;

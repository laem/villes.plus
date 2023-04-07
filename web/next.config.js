/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	compiler: {
		styledComponents: true,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'upload.wikimedia.org',
				pathname: '**',
			},
		],
	},
	async redirects() {
		return [
			{
				source: '/yo',
				destination: '/pietonnes',
				permanent: true,
			},
			{
				source: `/${encodeURIComponent('piétonnes')}/:path*`,
				destination: '/pietonnes/:path*',
				permanent: true,
			},
		]
	},
	webpack: (config, options) => {
		config.module.rules.push({
			test: /\.ya?ml$/,
			use: 'yaml-loader',
		})

		return config
	},
}

const withMDX = require('@next/mdx')()
module.exports = withMDX(nextConfig)

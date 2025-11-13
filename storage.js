import AWS from 'aws-sdk'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import algorithmVersion from './algorithmVersion'
dotenv.config()
export const BUCKET_NAME = process.env.BUCKET_NAME
console.log('bucket name:', BUCKET_NAME)
const S3_ENDPOINT_URL = process.env.S3_ENDPOINT_URL
const ID = process.env.ACCESS_KEY_ID
const SECRET = process.env.ACCESS_KEY

// Create S3 service object
export const s3 = new AWS.S3({
	endpoint: S3_ENDPOINT_URL,
	s3ForcePathStyle: true, // for minio
	credentials: {
		accessKeyId: ID,
		secretAccessKey: SECRET,
	},
})

export const testStorage = async () => {
	try {
		await s3
			.putObject({
				Bucket: BUCKET_NAME,
				Key: 'yo.txt',
				Body: `S3 storage test file`,
			})
			.promise()

		console.log(
			`Successfully wrote test file to bucket: ${BUCKET_NAME}.`)
	} catch (e) {
		// ignore error in case the file already exists
		console.log('Problem writing S3 test object', e)
	}

	try {
		const data = await s3
			.getObject({
				Bucket: BUCKET_NAME,
				Key: 'yo.txt',
			})
			.promise()

		console.log(
			`Successfully read test file from ${BUCKET_NAME} : S3 storage works.`
		)

		console.log(`<<${data.Body.toString('utf-8')}>>`)
	} catch (e) {
		console.log('Problem fetching S3 test object', e)
	}
}

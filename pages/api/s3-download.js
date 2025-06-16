// For public S3 bucket, we don't need AWS SDK - just generate direct URLs
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { key, fileName } = req.body;

        if (!key) {
            return res.status(400).json({ error: 'File key is required' });
        }

        const bucketName = process.env.AWS_S3_BUCKET_NAME || 'tl-discriminator';
        const region = process.env.AWS_REGION || 'ap-southeast-2';

        // Generate direct public S3 URL
        const downloadUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(key)}`;

        res.status(200).json({
            success: true,
            downloadUrl,
            expiresIn: null, // Public URLs don't expire
            fileName: fileName || key.split('/').pop()
        });

    } catch (error) {
        console.error('S3 Download Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate download URL',
            details: error.message
        });
    }
} 
const USE_MOCK = !process.env.OPENAI_API_KEY

// Placeholder image from picsum (stable, no auth needed)
const MOCK_IMAGE_URL = 'https://picsum.photos/seed/mission/1024/1024'

export async function POST(request) {
  const { prompt } = await request.json()

  if (USE_MOCK) {
    // Simulate a brief generation delay
    await new Promise(r => setTimeout(r, 1500))
    return Response.json({ url: MOCK_IMAGE_URL })
  }

  const { openai } = await import('@/lib/openai-client')

  const enhancedPrompt = `Create a vibrant, colorful, fun illustration for a community mission campaign. Style: cute, kawaii, friendly characters. Theme: ${prompt}. The image should be eye-catching and suitable for a mobile app mission card. No text in the image.`

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: enhancedPrompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
  })

  return Response.json({ url: response.data[0].url })
}

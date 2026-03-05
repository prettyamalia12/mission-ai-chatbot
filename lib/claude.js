import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const UPDATE_MISSION_PREVIEW_TOOL = {
  name: 'update_mission_preview',
  description: 'Update the live mission preview panel with the current mission configuration as it is being built through the conversation. Call this whenever mission details change.',
  input_schema: {
    type: 'object',
    properties: {
      mission_type: {
        type: 'string',
        enum: ['simple', 'milestone', 'multi_step'],
        description: 'The type of mission',
      },
      title: {
        type: 'string',
        description: 'Mission title',
      },
      description: {
        type: 'string',
        description: 'Mission description text',
      },
      community: {
        type: 'string',
        description: 'Community name this mission belongs to',
      },
      milestones: {
        type: 'array',
        description: 'For milestone missions, the list of levels',
        items: {
          type: 'object',
          properties: {
            level: { type: 'number' },
            requirement: { type: 'string', description: 'e.g. "Invite 2 friends"' },
            threshold: { type: 'number' },
            rewards: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', description: 'FDS, NFT, Voucher, XP, etc.' },
                  amount: { type: 'number' },
                  label: { type: 'string' },
                },
              },
            },
          },
        },
      },
      steps: {
        type: 'array',
        description: 'For simple or multi-step missions',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            threshold: { type: 'number' },
            completed: { type: 'boolean' },
          },
        },
      },
      duration: {
        type: 'object',
        properties: {
          start_date: { type: 'string', description: 'ISO date string or human-readable' },
          end_date: { type: 'string', description: 'ISO date string or human-readable' },
          days: { type: 'number' },
        },
      },
      cover_image_url: {
        type: 'string',
        description: 'URL of the generated cover image',
      },
      completion_percentage: {
        type: 'number',
        description: 'Estimated % completion of mission configuration (0-100)',
      },
    },
    required: ['completion_percentage'],
  },
}

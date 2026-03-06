import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const GENERATE_COVER_IMAGE_TOOL_OPENAI = {
  type: 'function',
  function: {
    name: 'generate_cover_image',
    description: 'Trigger AI generation of a cover image for the mission. Call this when the user confirms they want a cover image generated.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'A short description of the mission to use as the image generation prompt (e.g. mission title and theme).',
        },
      },
      required: ['prompt'],
    },
  },
}

export const UPDATE_MISSION_PREVIEW_TOOL_OPENAI = {
  type: 'function',
  function: {
    name: 'update_mission_preview',
    description: 'Update the live mission preview panel with the current mission configuration as it is being built through the conversation. Call this whenever mission details change.',
    parameters: {
      type: 'object',
      properties: {
        mission_type: { type: 'string', enum: ['simple', 'milestone', 'multi_step'] },
        title: { type: 'string' },
        description: { type: 'string' },
        community: { type: 'string' },
        milestones: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              level: { type: 'number' },
              requirement: { type: 'string' },
              threshold: { type: 'number' },
              rewards: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string' },
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
            start_date: { type: 'string' },
            end_date: { type: 'string' },
            days: { type: 'number' },
          },
        },
        cover_image_url: { type: 'string' },
        terms_and_conditions: { type: 'string' },
        completion_percentage: { type: 'number' },
      },
      required: ['completion_percentage'],
    },
  },
}

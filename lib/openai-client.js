import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const GENERATE_MISSION_CONFIG_TOOL_OPENAI = {
  type: 'function',
  function: {
    name: 'generate_mission_config',
    description: 'Generate the final QuestLab-ready API payload after the user confirms the mission configuration. Call this once after the user says "confirm" or approves the summary.',
    parameters: {
      type: 'object',
      properties: {
        metric: {
          type: 'object',
          description: 'Metric configuration. Omit entirely if the mission uses only User Actions (no event tracking).',
          properties: {
            name: { type: 'string', description: 'Metric slug name (lowercase, dash-separated). e.g. fdp-payment-completed-gift-of-happiness-donation' },
            eventName: { type: 'string', description: 'Exact Segment event name. e.g. Fdp Payment Completed' },
            conditions: {
              type: 'array',
              description: 'Event property filters',
              items: {
                type: 'object',
                properties: {
                  property: { type: 'string' },
                  operator: { type: 'string', enum: ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL', 'ANY'] },
                  value: { type: 'string' },
                },
              },
            },
            incrementProperty: { type: 'string', description: 'Property to increment progress by. e.g. order_amount, quantity. Null if threshold = 1 per event.' },
            propagateToSubEntities: { type: 'boolean', description: 'Always true for Freedom missions.' },
          },
          required: ['name', 'eventName'],
        },
        quest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            imageURL: { type: 'string', description: 'Cover image URL or empty string.' },
            status: { type: 'string', enum: ['ACTIVE', 'INACTIVE'], description: 'Use ACTIVE to publish immediately.' },
            visibility: { type: 'string', enum: ['PUBLIC'], description: 'Always PUBLIC.' },
            startsAt: { type: 'number', description: 'Unix timestamp in milliseconds. Null for evergreen.' },
            endsAt: { type: 'number', description: 'Unix timestamp in milliseconds. Null for evergreen.' },
            frequency: { type: 'string', enum: ['', 'DAILY', 'WEEKLY', 'MONTHLY'], description: 'Empty string for evergreen.' },
            allowRepeatEntries: { type: 'boolean', description: 'True for frequency missions (daily/weekly/monthly).' },
            isDependentCriterias: { type: 'boolean', description: 'True for dependent multi-step missions.' },
            missionType: { type: 'string', enum: ['simple', 'milestone', 'multi_step'] },
            communityId: { type: 'string', description: 'Community ID from the Community Directory.' },
            termsAndConditions: { type: 'string', description: 'T&C text if provided. Omit if not applicable.' },
            milestones: {
              type: 'array',
              description: 'For milestone (SNQ) missions only.',
              items: {
                type: 'object',
                properties: {
                  level: { type: 'number' },
                  label: { type: 'string', description: 'Task title, max 35 chars.' },
                  threshold: { type: 'number' },
                  rewardId: { type: 'string', description: 'Placeholder: to be filled with actual reward ID from rewards catalog.' },
                  rewardLabel: { type: 'string', description: 'Human-readable reward description for reference.' },
                },
              },
            },
            steps: {
              type: 'array',
              description: 'For multi-step missions only.',
              items: {
                type: 'object',
                properties: {
                  position: { type: 'number' },
                  label: { type: 'string', description: 'Task title, max 35 chars.' },
                  trackingType: { type: 'string', enum: ['USER_ACTION', 'USER_EVENT'] },
                  metricName: { type: 'string', description: 'Metric name if trackingType is USER_EVENT.' },
                  threshold: { type: 'number' },
                },
              },
            },
            threshold: { type: 'number', description: 'For simple missions: the single completion threshold.' },
            rewardId: { type: 'string', description: 'For simple missions: placeholder reward ID.' },
            rewardLabel: { type: 'string', description: 'For simple missions: human-readable reward description.' },
          },
          required: ['title', 'description', 'status', 'visibility', 'frequency', 'allowRepeatEntries', 'missionType'],
        },
        notes: { type: 'string', description: 'Any caveats or manual steps required (e.g. reward IDs need to be looked up in rewards catalog).' },
      },
      required: ['quest'],
    },
  },
}

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

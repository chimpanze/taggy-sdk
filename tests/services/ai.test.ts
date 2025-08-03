import { describe, it, expect, beforeEach } from 'vitest';
import { AIService } from '../../src/services/ai';
import { createMockFetcher, testServiceMethod } from './service-test-utils';

describe('AIService', () => {
  let service: AIService;

  beforeEach(() => {
    // Create mock fetcher and service instance
    const { mockFetcher } = createMockFetcher();
    service = new AIService(mockFetcher);
  });

  describe('analyzeContent', () => {
    it('should make a POST request to analyze content', async () => {
      const requestData = { contentId: 123 };
      const expectedResponse = {
        suggestions: [
          { tag: 'technology', confidence: 0.95 },
          { tag: 'programming', confidence: 0.85 },
        ],
      };

      await testServiceMethod(
        service,
        'analyzeContent',
        {
          path: '/ai/analyze',
          method: 'post',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('listModels', () => {
    it('should make a GET request to list AI models', async () => {
      const expectedResponse = {
        models: [
          { id: 'gpt-4', name: 'GPT-4', description: 'Advanced language model' },
          { id: 'custom-tagger', name: 'Custom Tagger', description: 'User-trained model' },
        ],
      };

      await testServiceMethod(
        service,
        'listModels',
        {
          path: '/ai/models',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('getSettings', () => {
    it('should make a GET request to retrieve AI settings', async () => {
      const expectedResponse = {
        autoTagging: true,
        preferredModel: 'gpt-4',
        confidenceThreshold: 0.7,
      };

      await testServiceMethod(
        service,
        'getSettings',
        {
          path: '/ai/settings',
          method: 'get',
        },
        expectedResponse
      );
    });
  });

  describe('updateSettings', () => {
    it('should make a PUT request to update AI settings', async () => {
      const requestData = {
        autoTagging: false,
        preferredModel: 'custom-tagger',
        confidenceThreshold: 0.8,
      };
      const expectedResponse = {
        ...requestData,
        updated: true,
      };

      await testServiceMethod(
        service,
        'updateSettings',
        {
          path: '/ai/settings',
          method: 'put',
          requestData,
        },
        expectedResponse,
        requestData
      );
    });
  });

  describe('getSuggestions', () => {
    it('should make a GET request to get suggestions for a content item', async () => {
      const contentId = 123;
      const expectedResponse = {
        suggestions: [
          { tag: 'technology', confidence: 0.95 },
          { tag: 'programming', confidence: 0.85 },
        ],
      };

      await testServiceMethod(
        service,
        'getSuggestions',
        {
          path: '/ai/suggestions/{contentId}',
          actualPath: `/ai/suggestions/${contentId}`,
          method: 'get',
        },
        expectedResponse,
        contentId
      );
    });
  });

  describe('trainModel', () => {
    it('should make a POST request to train the AI model', async () => {
      const expectedResponse = {
        status: 'training_started',
        estimatedCompletionTime: '2025-08-03T00:04:00Z',
      };

      await testServiceMethod(
        service,
        'trainModel',
        {
          path: '/ai/train',
          method: 'post',
        },
        expectedResponse
      );
    });
  });
});
import { describe, it, expect } from 'vitest';
import { isValidUrl, formatDate, generateRandomString } from '../../src/utils/helpers';

describe('Helper Functions', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:8080')).toBe(true);
      expect(isValidUrl('https://sub.domain.com/path?query=value#hash')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date to ISO string without milliseconds', () => {
      const date = new Date('2023-01-01T12:30:45.123Z');
      expect(formatDate(date)).toBe('2023-01-01T12:30:45Z');
    });

    it('should handle different date inputs', () => {
      const date1 = new Date('2023-05-15T08:00:00.000Z');
      const date2 = new Date('2023-12-31T23:59:59.999Z');
      
      expect(formatDate(date1)).toBe('2023-05-15T08:00:00Z');
      expect(formatDate(date2)).toBe('2023-12-31T23:59:59Z');
    });
  });

  describe('generateRandomString', () => {
    it('should generate a string of the specified length', () => {
      expect(generateRandomString(10).length).toBe(10);
      expect(generateRandomString(20).length).toBe(20);
      expect(generateRandomString(5).length).toBe(5);
    });

    it('should generate different strings on each call', () => {
      const str1 = generateRandomString(15);
      const str2 = generateRandomString(15);
      
      expect(str1).not.toBe(str2);
    });

    it('should contain only alphanumeric characters', () => {
      const str = generateRandomString(100);
      expect(str).toMatch(/^[A-Za-z0-9]+$/);
    });
  });
});
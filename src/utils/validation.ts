/**
 * Validation utilities for authentication forms
 */

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0: very weak, 1: weak, 2: fair, 3: good, 4: strong
  feedback: string[];
  isValid: boolean;
}

/**
 * Validate email format using RFC 5322 standard
 * @param email - Email address to validate
 * @returns true if email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.trim().length === 0) return false;

  // RFC 5322 compliant email regex (simplified but covers most cases)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email.trim());
}

/**
 * Check password strength based on OWASP guidelines
 * @param password - Password to validate
 * @returns PasswordStrength object with score and feedback
 */
export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score: 0 | 1 | 2 | 3 | 4 = 0;

  // Minimum length requirement (OWASP recommends 8+)
  if (!password || password.length === 0) {
    return {
      score: 0,
      feedback: ['パスワードを入力してください'],
      isValid: false,
    };
  }

  if (password.length < 6) {
    feedback.push('6文字以上必要です');
    return { score: 0, feedback, isValid: false };
  }

  if (password.length < 8) {
    feedback.push('8文字以上を推奨します');
    score = 1;
  } else {
    score = 2;
  }

  // Check for uppercase letters
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    feedback.push('大文字を含めると強度が上がります');
  } else {
    score += 1;
  }

  // Check for lowercase letters
  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    feedback.push('小文字を含めると強度が上がります');
  }

  // Check for numbers
  const hasNumbers = /\d/.test(password);
  if (!hasNumbers) {
    feedback.push('数字を含めると強度が上がります');
  } else {
    score += 1;
  }

  // Check for special characters
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  if (hasSpecialChars) {
    score += 1;
  } else {
    feedback.push('記号を含めると強度が上がります');
  }

  // Common password patterns (weak passwords)
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^abc123/i,
    /^111111/,
    /^letmein/i,
  ];

  const hasCommonPattern = commonPatterns.some((pattern) => pattern.test(password));
  if (hasCommonPattern) {
    feedback.push('よく使われるパスワードは避けてください');
    score = Math.max(0, score - 2) as 0 | 1 | 2 | 3 | 4;
  }

  // Sequential characters (e.g., "abcd", "1234")
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    feedback.push('連続した文字は避けてください');
    score = Math.max(0, score - 1) as 0 | 1 | 2 | 3 | 4;
  }

  // Repeated characters (e.g., "aaa", "111")
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('同じ文字の繰り返しは避けてください');
    score = Math.max(0, score - 1) as 0 | 1 | 2 | 3 | 4;
  }

  // Cap score at 4
  if (score > 4) score = 4;

  // Determine if password is valid (minimum requirements met)
  const isValid = password.length >= 6 && score >= 1;

  // Provide positive feedback for strong passwords
  if (score >= 4) {
    feedback.push('✓ 強力なパスワードです');
  } else if (score === 3) {
    feedback.push('✓ 良いパスワードです');
  }

  return {
    score,
    feedback,
    isValid,
  };
}

/**
 * Get password strength label
 * @param score - Password strength score (0-4)
 * @returns Localized strength label
 */
export function getPasswordStrengthLabel(score: 0 | 1 | 2 | 3 | 4): string {
  switch (score) {
    case 0:
      return '非常に弱い';
    case 1:
      return '弱い';
    case 2:
      return '普通';
    case 3:
      return '良い';
    case 4:
      return '強い';
    default:
      return '';
  }
}

/**
 * Get password strength color class
 * @param score - Password strength score (0-4)
 * @returns CSS color class
 */
export function getPasswordStrengthColor(score: 0 | 1 | 2 | 3 | 4): string {
  switch (score) {
    case 0:
      return 'text-red-600';
    case 1:
      return 'text-orange-500';
    case 2:
      return 'text-yellow-500';
    case 3:
      return 'text-blue-500';
    case 4:
      return 'text-green-600';
    default:
      return 'text-gray-400';
  }
}

/**
 * Get password strength progress color
 * @param score - Password strength score (0-4)
 * @returns CSS background color class
 */
export function getPasswordStrengthBarColor(score: 0 | 1 | 2 | 3 | 4): string {
  switch (score) {
    case 0:
      return 'bg-red-500';
    case 1:
      return 'bg-orange-400';
    case 2:
      return 'bg-yellow-400';
    case 3:
      return 'bg-blue-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
}

/**
 * Validate display name
 * @param displayName - Display name to validate
 * @returns true if valid
 */
export function isValidDisplayName(displayName: string): boolean {
  if (!displayName || displayName.trim().length === 0) return true; // Optional field

  const trimmed = displayName.trim();

  // Check length (1-50 characters)
  if (trimmed.length > 50) return false;

  // Allow letters, numbers, spaces, and common symbols
  const validPattern = /^[a-zA-Z0-9\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF_-]+$/;

  return validPattern.test(trimmed);
}

/**
 * Sanitize display name
 * @param displayName - Display name to sanitize
 * @returns Sanitized display name
 */
export function sanitizeDisplayName(displayName: string): string {
  if (!displayName) return '';

  // Trim whitespace
  let sanitized = displayName.trim();

  // Remove multiple consecutive spaces
  sanitized = sanitized.replace(/\s+/g, ' ');

  // Limit length
  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }

  return sanitized;
}

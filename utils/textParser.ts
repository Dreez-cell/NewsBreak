// Utility functions for parsing mentions and hashtags

export interface ParsedSegment {
  type: 'text' | 'mention' | 'hashtag';
  content: string;
  userId?: string; // For mentions
}

export function parseText(text: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  const regex = /(@\w+)|(\#\w+)|([^@#]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      // Mention
      segments.push({
        type: 'mention',
        content: match[1],
      });
    } else if (match[2]) {
      // Hashtag
      segments.push({
        type: 'hashtag',
        content: match[2],
      });
    } else if (match[3]) {
      // Regular text
      segments.push({
        type: 'text',
        content: match[3],
      });
    }
  }

  return segments;
}

export function extractMentions(text: string): string[] {
  const mentions = text.match(/@\w+/g) || [];
  return mentions.map(m => m.slice(1)); // Remove @ symbol
}

export function extractHashtags(text: string): string[] {
  const hashtags = text.match(/#\w+/g) || [];
  return hashtags.map(h => h.slice(1).toLowerCase()); // Remove # and lowercase
}

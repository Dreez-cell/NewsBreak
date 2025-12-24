import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { parseText, ParsedSegment } from '../../utils/textParser';
import { theme } from '../../constants/theme';
import { useUsers } from '../../hooks/useUsers';

interface RichTextProps {
  content: string;
  style?: TextStyle;
}

export function RichText({ content, style }: RichTextProps) {
  const router = useRouter();
  const { users } = useUsers();
  const segments = parseText(content);

  const handleMentionPress = (username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      router.push(`/user/${user.id}`);
    }
  };

  const handleHashtagPress = (hashtag: string) => {
    router.push(`/hashtag/${hashtag}`);
  };

  return (
    <Text style={style}>
      {segments.map((segment, index) => {
        if (segment.type === 'mention') {
          return (
            <Text
              key={index}
              style={{ color: theme.colors.primary, fontWeight: '600' }}
              onPress={() => handleMentionPress(segment.content.slice(1))}
            >
              {segment.content}
            </Text>
          );
        }

        if (segment.type === 'hashtag') {
          return (
            <Text
              key={index}
              style={{ color: theme.colors.trending, fontWeight: '600' }}
              onPress={() => handleHashtagPress(segment.content.slice(1))}
            >
              {segment.content}
            </Text>
          );
        }

        return <Text key={index}>{segment.content}</Text>;
      })}
    </Text>
  );
}

import { fetchTranscript } from 'youtube-transcript-plus';
import { getConfig } from './user-config.js';

export interface TranscriptSegment {
  text: string;
  offset: number;
  duration: number;
}

export interface TranscriptResult {
  segments: TranscriptSegment[];
  fullText: string;
  language: string;
}

export interface TranscriptError {
  error: string;
}

export function cleanTranscriptText(text: string): string {
  return text
    .replace(/\[.*?\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, (match) => {
      const code = parseInt(match.slice(2, -1), 10);
      return String.fromCharCode(code);
    });
}

export async function getTranscript(
  videoId: string,
  language?: string,
): Promise<TranscriptResult | TranscriptError> {
  try {
    const config = getConfig();
    const lang = language ?? config.transcript.defaultLanguage;
    const rawSegments = await fetchTranscript(videoId, { lang });

    const segments: TranscriptSegment[] = rawSegments
      .slice(0, config.transcript.maxSegments)
      .map(seg => ({
        text: decodeHtmlEntities(seg.text),
        offset: seg.offset,
        duration: seg.duration,
      }));

    const joinedText = segments.map(s => s.text).join(' ');
    const fullText = config.transcript.cleanupEnabled
      ? cleanTranscriptText(joinedText)
      : joinedText;

    return {
      segments,
      fullText,
      language: lang,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('disabled')) {
      return { error: `Transcripts are disabled for video ${videoId}.` };
    }
    if (message.includes('unavailable') || message.includes('Unavailable')) {
      return { error: `Video ${videoId} is unavailable — it may have been removed or is private.` };
    }
    if (message.includes('language') || message.includes('Language')) {
      return { error: `Transcript not available in requested language for video ${videoId}. Try without specifying a language.` };
    }
    if (message.includes('Too many')) {
      return { error: `Rate limited by YouTube. Wait a moment and try again.` };
    }

    return { error: `Could not fetch transcript for video ${videoId}: ${message}` };
  }
}

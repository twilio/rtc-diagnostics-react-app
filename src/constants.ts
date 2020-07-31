import { Region } from './types';
import { Connection } from 'twilio-client';

export const DEFAULT_REGIONS: Region[] = ['roaming', 'dublin'];

export const DEFAULT_CODEC_PREFERENCES: Connection.Codec[] = [Connection.Codec.PCMU, Connection.Codec.Opus];

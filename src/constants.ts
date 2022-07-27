import { Edge } from './types';
import { Connection } from 'twilio-client';
import { default as appInfo } from '../package.json';

export const APP_NAME = appInfo.name;

export const DEFAULT_EDGES: Edge[] = ['roaming'];

export const DEFAULT_CODEC_PREFERENCES: Connection.Codec[] = [Connection.Codec.PCMU, Connection.Codec.Opus];

export const LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'debug' : 'error';

export const MAX_SELECTED_EDGES = 3;

export const MIN_SELECTED_EDGES = 1;

export const AUDIO_LEVEL_THRESHOLD = 200;

export const AUDIO_LEVEL_STANDARD_DEVIATION_THRESHOLD = AUDIO_LEVEL_THRESHOLD * 0.05; // 5% threshold

export const INPUT_TEST_DURATION = 20000;

export const RECORD_DURATION = 4000;

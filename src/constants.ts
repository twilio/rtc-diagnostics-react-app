import { Edge } from './types';
import { Connection } from 'twilio-client';

export const DEFAULT_EDGES: Edge[] = ['roaming'];

export const DEFAULT_CODEC_PREFERENCES: Connection.Codec[] = [Connection.Codec.PCMU, Connection.Codec.Opus];

export const MAX_SELECTED_EDGES = 3;

export const MIN_SELECTED_EDGES = 1;

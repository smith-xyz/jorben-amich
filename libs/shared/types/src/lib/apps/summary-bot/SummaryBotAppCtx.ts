import { AppCtx } from '../../common';
import { IMemoryCache } from '@cache';

export type SummaryBotAppName = 'summary-bot';

export type SummaryBotAppCtx = AppCtx<null, IMemoryCache<string, unknown>>;

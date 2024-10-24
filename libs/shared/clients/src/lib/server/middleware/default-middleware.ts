import express from 'express';
import helmet, { HelmetOptions } from 'helmet';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { OptionsJson, OptionsUrlencoded } from 'body-parser';

export interface DefaultMiddlewareOptions {
  helmetOpts?: HelmetOptions;
  corsOpts?: CorsOptions;
  morganFormat?: string;
  cookieParserOpts?: {
    secret?: string | string[];
    options?: cookieParser.CookieParseOptions;
  };
  expressJsonOpts?: OptionsJson;
  expressUrlEncodedOpts?: OptionsUrlencoded;
}

export const defaultMiddleware = ({
  helmetOpts,
  corsOpts,
  morganFormat = 'combined',
  cookieParserOpts = { secret: null, options: null },
  expressJsonOpts,
  expressUrlEncodedOpts,
}: DefaultMiddlewareOptions) => [
  helmet(helmetOpts),
  cors(corsOpts),
  morgan(morganFormat),
  cookieParser(cookieParserOpts.secret, cookieParserOpts.options),
  express.json(expressJsonOpts),
  express.urlencoded(expressUrlEncodedOpts),
];

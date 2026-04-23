import { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://www.ghausglobal.com',
  'https://ghausglobal.com',
  'https://admin.ghausglobal.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:8080',
];

export function getCorsHeaders(origin: string | null) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin || '')
    ? origin!
    : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cache-Control, Pragma, Expires',
    'Access-Control-Max-Age': '86400',
  };
}

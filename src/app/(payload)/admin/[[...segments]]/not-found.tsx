import type { Metadata } from 'next';
import config from '@/lib/payload.config';
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// See page.tsx in this directory for why this cast is needed (a published
// type mismatch between @payloadcms/next and Next 16's generated route types).
type PayloadSearchParams = Promise<{ [key: string]: string | string[] }>;

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams: searchParams as PayloadSearchParams });

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams: searchParams as PayloadSearchParams, importMap });

export default NotFound;

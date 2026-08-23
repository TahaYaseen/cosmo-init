import type { Metadata } from 'next';
import config from '@/lib/payload.config';
import { RootPage, generatePageMetadata } from '@payloadcms/next/views';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// NOTE: @payloadcms/next's own type declarations (written against an older
// Next.js PageProps shape) type searchParams without `| undefined`, while
// Next 16's generated route types always include `| undefined` for optional
// query params. The runtime values are identical — this is a published type
// mismatch between the two packages, so we narrow via `as` at the call site.
type PayloadSearchParams = Promise<{ [key: string]: string | string[] }>;

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams: searchParams as PayloadSearchParams });

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams: searchParams as PayloadSearchParams, importMap });

export default Page;

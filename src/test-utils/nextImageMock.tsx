import type { ImgHTMLAttributes } from 'react';

/**
 * Vitest-only stand-in for next/image: renders a plain <img>, since jsdom
 * has no image-optimization server and next/image's real component
 * requires Next's runtime context to render meaningfully in tests.
 */
type MockImageProps = ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; sizes?: string };

export default function Image(props: MockImageProps) {
  const { src, alt, fill, sizes, ...rest } = props;
  void fill;
  void sizes;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} {...rest} />;
}

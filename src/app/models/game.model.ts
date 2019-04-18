export class Game {
  $key?: string;
  gid?: string;
  tickets?: number;
  st?: number;
  et?: number;
  gt?: number;
  tc?: string;
  registered?: boolean;
  showPublic?: boolean;
  sponcers?: Sponcer[];
  gst?: number;
  cnum?: any;
  pnum?: any;
  winners?: any;
  prizes?: Prize[];
  gameRunsOn?: string;
  gameThumb?: string;
}

export class Sponcer {
  logo?: string;
  bannerLg?: string;
  bannerMd?: string;
  bannerSm?: string;
  mailBanner?: string;
  redirectLink?: string;
  title?: string;
  type?: string;
}

export class Prize {
  p1?: string;
  p2?: number;
  p3?: number;
}

export class Sponsor {
  constructor(
    public gid?: string,
    public title?: string,
    public siteUrl?: string,
    public banners?: {
      blg?: string,
      bmd?: string,
      bsm?: string
    },
    public logoUrl?: string
  ) {
    const Obj = {
      gid: gid || '',
      title: title || '',
      siteUrl: siteUrl || '',
      banners: banners || {blg: '', bmd: '', bsm: ''},
      logoUrl: logoUrl || null
    };
    return Obj;
  }
}

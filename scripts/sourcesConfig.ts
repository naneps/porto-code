export const sourcesConfig: any = {
  // ─── EXISTING SOURCES ────────────────────────────────────────────────────────

  antara: {
    name: 'Antara News',
    baseUrl: 'https://www.antaranews.com/rss/',
    categories: {
      terbaru: 'terkini.xml',
      politik: 'politik.xml',
      hukum: 'hukum',
      ekonomi: 'ekonomi.xml',
      metro: 'metro',
      bola: 'sepakbola.xml',
      olahraga: 'olahraga',
      humaniora: 'humaniora',
      tekno: 'tekno.xml',
      otomotif: 'otomotif.xml',
      hiburan: 'hiburan.xml',
      lifestyle: 'lifestyle.xml',
      dunia: 'dunia',
      warta_bumi: 'warta-bumi',
      rilis_pers: 'rilis-pers'
    },
    selectors: {
      content: 'article, .post-content, .entry-content, .detail-content',
      author: '.author, .writer, .byline, .text-muted, .reporter',
      tags: '.tags a, .tag-links a, .detail-tag a'
    }
  },

  cnn: {
    name: 'CNN Indonesia',
    baseUrl: 'https://www.cnnindonesia.com/',
    categories: {
      terbaru: 'rss',
      nasional: 'nasional/rss',
      internasional: 'internasional/rss',
      ekonomi: 'ekonomi/rss',
      olahraga: 'olahraga/rss',
      teknologi: 'teknologi/rss',
      hiburan: 'hiburan/rss',
      gaya_hidup: 'gaya-hidup/rss'
    },
    selectors: {
      content: '.detail-text, #detikdetailtext',
      author: '.author, .writer',
      tags: '.detail-tag a'
    }
  },

  cnbc: {
    name: 'CNBC Indonesia',
    baseUrl: 'https://www.cnbcindonesia.com/',
    categories: {
      terbaru: 'news/rss',
      investment: 'investment/rss',
      market: 'market/rss',
      entrepreneur: 'entrepreneur/rss',
      syariah: 'syariah/rss',
      tech: 'tech/rss',
      lifestyle: 'lifestyle/rss',
      opini: 'opini/rss',
      profil: 'profil/rss'
    },
    selectors: {
      content: '.detail_text',
      author: '.author, .writer',
      tags: '.detail_tag a'
    }
  },

  republika: {
    name: 'Republika',
    baseUrl: 'https://www.republika.co.id/rss/',
    categories: {
      terbaru: '',
      nasional: 'nasional',
      hukum: 'nasional/hukum',
      politik: 'nasional/politik',
      internasional: 'internasional',
      ekonomi: 'ekonomi',
      sepakbola: 'sepakbola',
      leisure: 'leisure',
      khazanah: 'khazanah',
      islam: 'dunia-islam',
      umroh: 'dunia-islam/umroh-haji',
      halal: 'dunia-islam/halal'
    },
    selectors: {
      content: '.detail-konten, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },

  tempo: {
    name: 'Tempo',
    baseUrl: 'https://rss.tempo.co/',
    categories: {
      nasional: 'nasional',
      bisnis: 'bisnis',
      metro: 'metro',
      dunia: 'dunia',
      bola: 'bola',
      cantik: 'cantik',
      tekno: 'tekno',
      otomotif: 'otomotif',
      seleb: 'seleb',
      gaya: 'gaya',
      travel: 'travel',
      difabel: 'difabel',
      creativelab: 'creativelab',
      inggris: 'inggris'
    },
    selectors: {
      content: '.detail-konten, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },

  merdeka: {
    name: 'Merdeka',
    baseUrl: 'https://www.merdeka.com/feed/',
    categories: {
      terbaru: '',
      jakarta: 'jakarta',
      dunia: 'dunia',
      gaya: 'gaya',
      olahraga: 'olahraga',
      teknologi: 'teknologi',
      otomotif: 'otomotif',
      sehat: 'sehat',
      khas: 'khas',
      jabar: 'jabar',
      jatim: 'jatim',
      jateng: 'jateng',
      sumut: 'sumut'
    },
    selectors: {
      content: '.mdk-body-artikel, .article-content',
      author: '.reporter, .writer',
      tags: '.tag a'
    }
  },

  okezone: {
    name: 'Okezone',
    baseUrl: 'https://sindikasi.okezone.com/index.php/rss/',
    categories: {
      terbaru: '0/RSS2.0',
      celebrity: '13/RSS2.0',
      sports: '2/RSS2.0',
      otomotif: '15/RSS2.0',
      economy: '11/RSS2.0',
      techno: '16/RSS2.0',
      lifestyle: '12/RSS2.0',
      bola: '14/RSS2.0'
    },
    selectors: {
      content: '.read, .content-read, .detail-text',
      author: '.reporter, .writer',
      tags: '.tag a'
    },
    postKeys: { thumbnail: 'imglink' }
  },

  sindonews: {
    name: 'Sindonews',
    baseUrl: 'https://www.sindonews.com/feed/',
    categories: {
      terbaru: '',
      nasional: 'nasional',
      metro: 'metro',
      ekonomi: 'ekonomi',
      international: 'international',
      daerah: 'daerah',
      sports: 'sports',
      otomotif: 'otomotif',
      tekno: 'tekno',
      sains: 'sains',
      edukasi: 'edukasi',
      lifestyle: 'lifestyle',
      kalam: 'kalam'
    },
    selectors: {
      content: '#content, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },

  suara: {
    name: 'Suara.com',
    baseUrl: 'https://www.suara.com/rss/',
    categories: {
      terbaru: '',
      bisnis: 'bisnis',
      bola: 'bola',
      lifestyle: 'lifestyle',
      entertainment: 'entertainment',
      otomotif: 'otomotif',
      tekno: 'tekno',
      health: 'health'
    },
    selectors: {
      content: '.detail-content, .article-content',
      author: '.author-name, .writer',
      tags: '.tag a'
    }
  },

  tribun: {
    name: 'Tribun News',
    baseUrl: 'https://www.tribunnews.com/rss/',
    categories: {
      terbaru: '',
      bisnis: 'bisnis',
      superskor: 'superskor',
      sport: 'sport',
      seleb: 'seleb',
      lifestyle: 'lifestyle',
      travel: 'travel',
      parapuan: 'parapuan',
      otomotif: 'otomotif',
      techno: 'techno',
      kesehatan: 'kesehatan'
    },
    selectors: {
      content: '.txt-article, .article-content',
      author: '#penulis, .writer',
      tags: '.tag a'
    }
  },

  kumparan: {
    name: 'Kumparan',
    baseUrl: 'https://lapi.kumparan.com/v3.0/rss/',
    categories: {
      terbaru: ''
    },
    selectors: {
      content: '.detail-content, .article-content',
      author: '.author-name, .writer',
      tags: '.tag a'
    }
  },

  jpnn: {
    name: 'JPNN',
    baseUrl: 'https://www.jpnn.com/index.php?mib=rss',
    categories: {
      terbaru: ''
    },
    selectors: {
      content: '.content, .article-content',
      author: '.author, .writer',
      tags: '.tag a'
    }
  },

  // ─── NEW SOURCES ──────────────────────────────────────────────────────────────

  detik: {
    name: 'Detik.com',
    // Detik menggunakan subdomain per kategori, baseUrl tidak digunakan langsung
    // URL tiap kategori sudah full: https://<subdomain>.detik.com/rss
    baseUrl: 'https://news.detik.com/rss',
    categories: {
      // Setiap value adalah URL lengkap (override baseUrl)
      terbaru: 'https://news.detik.com/rss',
      nasional: 'https://news.detik.com/rss',
      finance: 'https://finance.detik.com/rss',
      inet: 'https://inet.detik.com/rss',
      sport: 'https://sport.detik.com/rss',
      bola: 'https://sport.detik.com/sepakbola/rss',
      otomotif: 'https://oto.detik.com/rss',
      food: 'https://food.detik.com/rss',
      health: 'https://health.detik.com/rss',
      hot: 'https://hot.detik.com/rss',
      wolipop: 'https://wolipop.detik.com/rss',
      edu: 'https://www.detik.com/edu/rss',
      properti: 'https://www.detik.com/properti/rss',
      travel: 'https://travel.detik.com/rss'
    },
    selectors: {
      content: '.detail__body-text, .itp_bodycontent, article.detail',
      author: '.detail__author, .author, span[class*="author"]',
      tags: '.nav__tags a, .detail__tag a'
    }
  },

  kompas: {
    name: 'Kompas.com',
    baseUrl: 'https://www.kompas.com/getrss/',
    categories: {
      nasional: 'nasional',
      regional: 'regional',
      internasional: 'internasional',
      megapolitan: 'megapolitan',
      bisnis: 'bisniskeuangan',
      kesehatan: 'kesehatan',
      olahraga: 'olahraga',
      perempuan: 'perempuan',
      properti: 'properti',
      sains: 'sains',
      travel: 'travel',
      oase: 'oase',
      otomotif: 'otomotifteknologi',
      edukasi: 'edukasi'
    },
    selectors: {
      content: '.read__content, .article__content, div[class*="read__content"]',
      author: '.credit-title-name, .author__name, .read__credit--name',
      tags: '.article__tag a, .tag__article a'
    }
  },

  liputan6: {
    name: 'Liputan6',
    baseUrl: 'https://feed.liputan6.com/rss/',
    categories: {
      terbaru: 'news',
      bisnis: 'bisnis',
      bola: 'bola',
      showbiz: 'showbiz',
      lifestyle: 'lifestyle',
      tekno: 'tekno',
      otomotif: 'otomotif',
      health: 'health',
      tv: 'tv'
    },
    selectors: {
      content: '.article-content-body, div[class*="article-content"]',
      author: '.article-author-name, .author',
      tags: '.article-tag--item a, .tags a'
    }
  },

  viva: {
    name: 'Viva.co.id',
    baseUrl: 'https://www.viva.co.id/rss/',
    categories: {
      terbaru: 'https://viva.co.id/get/all',  // full URL RSS utama
      berita: 'berita',
      bisnis: 'bisnis',
      dunia: 'dunia',
      bola: 'bola',
      sport: 'sport',
      otomotif: 'otomotif',
      teknologi: 'teknologi',
      gaya_hidup: 'gaya-hidup',
      hiburan: 'hiburan'
    },
    selectors: {
      content: '.article-content, .content-details, div[itemprop="articleBody"]',
      author: '.author-name, .reporter, a[rel="author"]',
      tags: '.tag-list a, .tags a'
    }
  },

  mediaindonesia: {
    name: 'Media Indonesia',
    baseUrl: 'https://mediaindonesia.com/rss/',
    categories: {
      terbaru: '',
      politik: 'politik',
      ekonomi: 'ekonomi',
      olahraga: 'olahraga',
      sepakbola: 'sepakbola',
      megapolitan: 'megapolitan',
      tanah_air: 'tanahair',
      mancanegara: 'mancanegara',
      iptek: 'iptek',
      humaniora: 'humaniora',
      hiburan: 'hiburan',
      opini: 'opini'
    },
    selectors: {
      content: '.article-content, .mi-post-content, div[class*="detail-text"]',
      author: '.reporter, .author, .journalist',
      tags: '.tags a, .article-tags a'
    }
  },

  jawapos: {
    name: 'Jawa Pos',
    baseUrl: 'https://www.jawapos.com/feed/',
    categories: {
      terbaru: '',
      nasional: 'nasional/',
      ekonomi: 'ekonomi-bisnis/',
      olahraga: 'olahraga/',
      showbiz: 'show-and-entertainment/',
      lifestyle: 'lifestyle-health/',
      tekno: 'otomotif-tekno/'
    },
    selectors: {
      content: '.article-content, .detail-article, div[itemprop="articleBody"]',
      author: '.author-name, .detail-author span, .reporter',
      tags: '.article-tags a, .tags a'
    }
  },

  beritasatu: {
    name: 'Berita Satu',
    baseUrl: 'https://www.beritasatu.com/feed/rss/',
    categories: {
      terbaru: '',
      nasional: 'home/news',
      ekonomi: 'home/ekonomi',
      dunia: 'home/dunia',
      olahraga: 'home/olahraga',
      hiburan: 'home/hiburan',
      lifestyle: 'home/lifestyle',
      teknologi: 'home/teknologi',
      properti: 'home/properti'
    },
    selectors: {
      content: '.article-body, .content-detail, div[class*="article__body"]',
      author: '.article-author, .author, span[class*="author"]',
      tags: '.article-tags a, .tag a'
    }
  },

  detikfinance: {
    // Alias khusus detikFinance jika ingin dipakai terpisah
    name: 'detikFinance',
    baseUrl: 'https://finance.detik.com/rss',
    categories: {
      terbaru: '',
      bursa: 'https://finance.detik.com/bursa-dan-valas/rss',
      moneter: 'https://finance.detik.com/moneter/rss',
      bisnis: 'https://finance.detik.com/industri/rss',
      energi: 'https://finance.detik.com/energi/rss',
      umkm: 'https://finance.detik.com/umkm/rss'
    },
    selectors: {
      content: '.detail__body-text, .itp_bodycontent',
      author: '.detail__author',
      tags: '.nav__tags a'
    }
  },

  tirto: {
    name: 'Tirto.id',
    // RSS tersedia via sitemap Google Discover
    baseUrl: 'https://tirto.id/sitemap/r/',
    categories: {
      terbaru: 'google-discover'
    },
    selectors: {
      content: '.article-content, .read__article-body, div[class*="article-body"]',
      author: '.author__name, .byline__author, a[class*="author"]',
      tags: '.article__tags a, .tags__item a'
    }
  },

  voaindonesia: {
    name: 'VOA Indonesia',
    baseUrl: 'https://www.voaindonesia.com/api/',
    categories: {
      terbaru: 'zmgqol-vomx-tpeympp',
      indonesia: 'zmgo_l-vomx-tpeymmy',
      dunia: 'z-jqtl-vomx-tperypq',
      asia_pasifik: 'zjgqql-vomx-tpebmpo',
      gaya_hidup: 'zvjqil-vomx-tpeu_pm',
      kesehatan: 'ztgq_l-vomx-tpekmpv',
      hiburan: 'zggqrl-vomx-tpe-mpq'
    },
    selectors: {
      content: '.wsw, div[class*="article-content"]',
      author: '.byline__author, .author',
      tags: '.tags a'
    }
  },

  kapanlagi: {
    name: 'KapanLagi.com',
    baseUrl: 'https://www.kapanlagi.com/feed',
    categories: {
      terbaru: ''
    },
    selectors: {
      content: '.news-detail-content, .kl-article-content, div[class*="article-content"]',
      author: '.author, .reporter, .byline',
      tags: '.tag a, .detail-tag a'
    }
  },

  // ─── EXISTING KOREA SOURCES (unchanged) ───────────────────────────────────

  koreanTimes: {
    name: 'Korea Times',
    baseUrl: 'https://feed.koreatimes.co.kr/k/',
    categories: {
      terbaru: 'allnews.xml',
      nasional: 'southkorea.xml',
      bisnis: 'business.xml',
      ekonomi: 'economy.xml',
      hiburan: 'entertainment.xml',
      lifestyle: 'lifestyle.xml',
      olahraga: 'sports.xml',
      dunia: 'world.xml'
    },
    selectors: {
      content: 'div[class*="View_article"]',
      author: 'a[class*="ReporterInfo_name"]',
      tags: '[class*="TopicFollowButton_btn-text"]'
    }
  },

  yonhap: {
    name: 'Yonhap News',
    baseUrl: 'https://en.yna.co.kr/RSS/',
    categories: {
      terbaru: 'news.xml',
      top: 'topnews.xml',
      politik: 'politics.xml',
      ekonomi: 'economy.xml',
      olahraga: 'sports.xml',
      hiburan: 'entertainment.xml',
      lifestyle: 'culture.xml',
      north_korea: 'northkorea.xml'
    },
    selectors: {
      content: 'article.story-news',
      author: 'p.p_writer',
      tags: '.kwd-lst a'
    }
  },

  koreaHerald: {
    name: 'The Korea Herald',
    baseUrl: 'https://www.koreaherald.com/rss/',
    categories: {
      terbaru: 'newsAll',
      nasional: '0201010000',
      bisnis: '0201020000',
      lifestyle: '0201030000',
      hiburan: '0201040000',
      olahraga: '0201050000',
      dunia: '0201060000'
    },
    selectors: {
      content: '#articleBody',
      author: 'em.editor_name, .view_editors .name',
      tags: '.view_tag a'
    }
  },

  kcna: {
    name: 'KCNA Watch',
    baseUrl: 'https://kcnawatch.org/',
    categories: {
      terbaru: 'feed/'
    },
    selectors: {
      content: '.col-lg-9',
      author: '',
      tags: ''
    }
  }
};

/* — Atribusi aset gambar (CC BY / CC BY-SA / domain publik) ——— *
 *
 * DIHASILKAN dari `public/images/credits.json` (lihat skrip pembuatnya di
 * luar repo). JANGAN diedit manual — ubah JSON-nya lalu hasilkan ulang.
 *
 * Kenapa jadi modul TypeScript, bukan dibaca via `fs`?
 * Di Vercel, folder `public/` TIDAK disertakan ke filesystem fungsi
 * serverless. `fs.readFileSync(path.join(process.cwd(), "public", ...))`
 * gagal di sana, dan karena pemanggilnya memakai `catch { return [] }`,
 * halaman /kredit akan tampil kosong TANPA error yang terlihat.
 * Sebagai modul, datanya ikut ter-bundle saat build → aman di mana saja.
 */

export interface CreditFile {
  webp: string;
  w: number;
  h: number;
  kb: number;
}

export interface CreditEntry {
  name: string;
  note: string;
  ratio: string;
  title: string;
  license: string;
  artist: string;
  source: string;
  files: Record<string, CreditFile>;
}

export const CREDITS: CreditEntry[] = [
  {
    "name": "hero-dome-gold",
    "note": "Kubah bintang geometris emas",
    "ratio": "21:9",
    "title": "Blue Mosque Ceiling Blue Tiles.JPG",
    "license": "CC BY-SA 3.0",
    "artist": "Bjørn Christian Tørrissen",
    "source": "https://commons.wikimedia.org/wiki/File:Blue_Mosque_Ceiling_Blue_Tiles.JPG",
    "files": {
      "sm": {
        "webp": "hero-dome-gold-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 92
      },
      "md": {
        "webp": "hero-dome-gold-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 314
      },
      "lg": {
        "webp": "hero-dome-gold-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 611
      }
    }
  },
  {
    "name": "hero-dome-glass",
    "note": "Kubah kaca mosaik biru-emas",
    "ratio": "21:9",
    "title": "Ceiling of Tabatabaee mosque at Fatima Masumeh Shrine, qom, iran2.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Amir Pashaei",
    "source": "https://commons.wikimedia.org/wiki/File:Ceiling_of_Tabatabaee_mosque_at_Fatima_Masumeh_Shrine,_qom,_iran2.jpg",
    "files": {
      "sm": {
        "webp": "hero-dome-glass-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 94
      },
      "md": {
        "webp": "hero-dome-glass-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 363
      },
      "lg": {
        "webp": "hero-dome-glass-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 804
      }
    }
  },
  {
    "name": "hero-night-gold",
    "note": "Masjid bercahaya malam",
    "ratio": "21:9",
    "title": "Badshahi Mosque night view.JPG",
    "license": "CC BY-SA 3.0",
    "artist": "Ahmad Tahir",
    "source": "https://commons.wikimedia.org/wiki/File:Badshahi_Mosque_night_view.JPG",
    "files": {
      "sm": {
        "webp": "hero-night-gold-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 22
      },
      "md": {
        "webp": "hero-night-gold-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 62
      },
      "lg": {
        "webp": "hero-night-gold-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 120
      }
    }
  },
  {
    "name": "hero-arch-blue",
    "note": "Arkade masjid + langit",
    "ratio": "21:9",
    "title": "Vakil Mosque مسجد وکیل 14.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Mostafameraji",
    "source": "https://commons.wikimedia.org/wiki/File:Vakil_Mosque_%D9%85%D8%B3%D8%AC%D8%AF_%D9%88%DA%A9%DB%8C%D9%84_14.jpg",
    "files": {
      "sm": {
        "webp": "hero-arch-blue-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 18
      },
      "md": {
        "webp": "hero-arch-blue-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 58
      },
      "lg": {
        "webp": "hero-arch-blue-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 127
      }
    }
  },
  {
    "name": "hero-desert-dawn",
    "note": "Gurun saat fajar",
    "ratio": "21:9",
    "title": "Dubai desert sunset 1.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Sajitkk",
    "source": "https://commons.wikimedia.org/wiki/File:Dubai_desert_sunset_1.jpg",
    "files": {
      "sm": {
        "webp": "hero-desert-dawn-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 21
      },
      "md": {
        "webp": "hero-desert-dawn-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 64
      },
      "lg": {
        "webp": "hero-desert-dawn-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 118
      }
    }
  },
  {
    "name": "banner-nabawi",
    "note": "Masjid Nabawi",
    "ratio": "16:6",
    "title": "Wide shot of the Green Dome at The Prophet's Mosque (Al Masjid-e-Nabawi).jpg",
    "license": "CC0",
    "artist": "TheHadiRahim",
    "source": "https://commons.wikimedia.org/wiki/File:Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_(Al_Masjid-e-Nabawi).jpg",
    "files": {
      "sm": {
        "webp": "banner-nabawi-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 10
      },
      "md": {
        "webp": "banner-nabawi-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 29
      },
      "lg": {
        "webp": "banner-nabawi-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 56
      }
    }
  },
  {
    "name": "banner-kaaba-night",
    "note": "Kaaba malam",
    "ratio": "16:6",
    "title": "Supplicating Pilgrim at Masjid Al Haram. Mecca, Saudi Arabia.jpg",
    "license": "CC BY-SA 2.5",
    "artist": "Ali Mansuri",
    "source": "https://commons.wikimedia.org/wiki/File:Supplicating_Pilgrim_at_Masjid_Al_Haram._Mecca,_Saudi_Arabia.jpg",
    "files": {
      "sm": {
        "webp": "banner-kaaba-night-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 36
      },
      "md": {
        "webp": "banner-kaaba-night-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 86
      },
      "lg": {
        "webp": "banner-kaaba-night-lg.webp",
        "w": 1600,
        "h": 600,
        "kb": 109
      }
    }
  },
  {
    "name": "banner-prayer",
    "note": "Jamaah sholat",
    "ratio": "16:6",
    "title": "National Mosque Praying Together.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Jubersahel",
    "source": "https://commons.wikimedia.org/wiki/File:National_Mosque_Praying_Together.jpg",
    "files": {
      "sm": {
        "webp": "banner-prayer-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 67
      },
      "md": {
        "webp": "banner-prayer-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 211
      },
      "lg": {
        "webp": "banner-prayer-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 428
      }
    }
  },
  {
    "name": "banner-tile-blue",
    "note": "Ubin zellige biru",
    "ratio": "16:6",
    "title": "Samarkand Shah-i Zinda Tuman Aqa complex cropped2.jpg",
    "license": "CC BY 3.0",
    "artist": "User:Patrickringgenberg",
    "source": "https://commons.wikimedia.org/wiki/File:Samarkand_Shah-i_Zinda_Tuman_Aqa_complex_cropped2.jpg",
    "files": {
      "sm": {
        "webp": "banner-tile-blue-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 53
      },
      "md": {
        "webp": "banner-tile-blue-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 116
      },
      "lg": {
        "webp": "banner-tile-blue-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 179
      }
    }
  },
  {
    "name": "banner-mostar",
    "note": "Masjid tepi sungai",
    "ratio": "16:6",
    "title": "Mostar Old Town Panorama 2007.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "\nRamirez",
    "source": "https://commons.wikimedia.org/wiki/File:Mostar_Old_Town_Panorama_2007.jpg",
    "files": {
      "sm": {
        "webp": "banner-mostar-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 49
      },
      "md": {
        "webp": "banner-mostar-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 149
      },
      "lg": {
        "webp": "banner-mostar-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 276
      }
    }
  },
  {
    "name": "card-dome-mosaic",
    "note": "Kubah bermotif",
    "ratio": "4:3",
    "title": "Sheikh-Lotf-Allah mosque wall and ceiling.jpg",
    "license": "CC BY 3.0",
    "artist": "Phillip Maiwald Nikopol",
    "source": "https://commons.wikimedia.org/wiki/File:Sheikh-Lotf-Allah_mosque_wall_and_ceiling.jpg",
    "files": {
      "sm": {
        "webp": "card-dome-mosaic-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 150
      },
      "md": {
        "webp": "card-dome-mosaic-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 442
      },
      "lg": {
        "webp": "card-dome-mosaic-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 746
      }
    }
  },
  {
    "name": "card-lamp-blue",
    "note": "Lampu gantung masjid",
    "ratio": "4:3",
    "title": "Ravensburg Mevlana-Moschee Gebetsraum Leuchter 03.jpg",
    "license": "CC BY 3.0",
    "artist": "Photo: Andreas Praefcke",
    "source": "https://commons.wikimedia.org/wiki/File:Ravensburg_Mevlana-Moschee_Gebetsraum_Leuchter_03.jpg",
    "files": {
      "sm": {
        "webp": "card-lamp-blue-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 66
      },
      "md": {
        "webp": "card-lamp-blue-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 180
      },
      "lg": {
        "webp": "card-lamp-blue-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 316
      }
    }
  },
  {
    "name": "card-reflection",
    "note": "Masjid refleksi air",
    "ratio": "4:3",
    "title": "KotaKinabalu Sabah CityMosque-00.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "CEphoto, Uwe Aranas",
    "source": "https://commons.wikimedia.org/wiki/File:KotaKinabalu_Sabah_CityMosque-00.jpg",
    "files": {
      "sm": {
        "webp": "card-reflection-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 27
      },
      "md": {
        "webp": "card-reflection-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 72
      },
      "lg": {
        "webp": "card-reflection-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 136
      }
    }
  },
  {
    "name": "card-sunset-purple",
    "note": "Masjid senja",
    "ratio": "4:3",
    "title": "Sultan Omar Ali Saifuddin Mosque 02.jpg",
    "license": "CC BY 2.0",
    "artist": "sam garza from Los Angeles, USA",
    "source": "https://commons.wikimedia.org/wiki/File:Sultan_Omar_Ali_Saifuddin_Mosque_02.jpg",
    "files": {
      "sm": {
        "webp": "card-sunset-purple-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 34
      },
      "md": {
        "webp": "card-sunset-purple-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 88
      },
      "lg": {
        "webp": "card-sunset-purple-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 157
      }
    }
  },
  {
    "name": "card-minaret",
    "note": "Menara batu Maroko",
    "ratio": "4:3",
    "title": "Al-Mohammadi Mosque (221711383).jpg",
    "license": "CC BY 3.0",
    "artist": "\nBadr Outal",
    "source": "https://commons.wikimedia.org/wiki/File:Al-Mohammadi_Mosque_(221711383).jpg",
    "files": {
      "sm": {
        "webp": "card-minaret-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 39
      },
      "md": {
        "webp": "card-minaret-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 121
      },
      "lg": {
        "webp": "card-minaret-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 272
      }
    }
  },
  {
    "name": "card-garden",
    "note": "Taman islami",
    "ratio": "4:3",
    "title": "Fountains in Grande Mosquée de Paris September 26, 2011.jpg",
    "license": "CC BY 2.0",
    "artist": "Marc Cooper",
    "source": "https://commons.wikimedia.org/wiki/File:Fountains_in_Grande_Mosqu%C3%A9e_de_Paris_September_26,_2011.jpg",
    "files": {
      "sm": {
        "webp": "card-garden-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 104
      },
      "md": {
        "webp": "card-garden-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 312
      },
      "lg": {
        "webp": "card-garden-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 586
      }
    }
  },
  {
    "name": "card-nabawi-day",
    "note": "Masjid Nabawi siang",
    "ratio": "4:3",
    "title": "Medium shot of the Green Dome at The Prophet's Mosque (Al Masjid-e-Nabawi).jpg",
    "license": "CC0",
    "artist": "TheHadiRahim",
    "source": "https://commons.wikimedia.org/wiki/File:Medium_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_(Al_Masjid-e-Nabawi).jpg",
    "files": {
      "sm": {
        "webp": "card-nabawi-day-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 21
      },
      "md": {
        "webp": "card-nabawi-day-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 65
      },
      "lg": {
        "webp": "card-nabawi-day-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 128
      }
    }
  },
  {
    "name": "card-star-tile",
    "note": "Ubin bintang batu",
    "ratio": "4:3",
    "title": "Citadelle d'Alep - motif circulaire.jpg",
    "license": "CC BY 3.0",
    "artist": "",
    "source": "https://commons.wikimedia.org/wiki/File:Citadelle_d%27Alep_-_motif_circulaire.jpg",
    "files": {
      "sm": {
        "webp": "card-star-tile-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 128
      },
      "md": {
        "webp": "card-star-tile-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 450
      },
      "lg": {
        "webp": "card-star-tile-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 925
      }
    }
  },
  {
    "name": "card-muqarnas",
    "note": "Kubah muqarnas",
    "ratio": "4:3",
    "title": "Istanbul asv2020-02 img62 Ortaköy Mosque.jpg",
    "license": "FAL",
    "artist": "A.Savin",
    "source": "https://commons.wikimedia.org/wiki/File:Istanbul_asv2020-02_img62_Ortak%C3%B6y_Mosque.jpg",
    "files": {
      "sm": {
        "webp": "card-muqarnas-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 92
      },
      "md": {
        "webp": "card-muqarnas-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 290
      },
      "lg": {
        "webp": "card-muqarnas-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 599
      }
    }
  },
  {
    "name": "tex-manuscript",
    "note": "Mushaf tulisan tangan",
    "ratio": "21:9",
    "title": "Iran, Herat, Safavid Period, 16th century - Qur'an Manuscript Folio (Recto); Left Folio of Double-Page Illuminated Fron - 1924.746.2.a - Cleveland Museum of Art.tif",
    "license": "CC0",
    "artist": "",
    "source": "https://commons.wikimedia.org/wiki/File:Iran,_Herat,_Safavid_Period,_16th_century_-_Qur%27an_Manuscript_Folio_(Recto);_Left_Folio_of_Double-Page_Illuminated_Fron_-_1924.746.2.a_-_Cleveland_Museum_of_Art.tif",
    "files": {
      "sm": {
        "webp": "tex-manuscript-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 79
      },
      "md": {
        "webp": "tex-manuscript-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 234
      },
      "lg": {
        "webp": "tex-manuscript-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 444
      }
    }
  },
  {
    "name": "tex-calligraphy",
    "note": "Kaligrafi tembaga antik",
    "ratio": "21:9",
    "title": "Tray incised across top with 12 tribes, figure of Moses and Ten Commandments, Syria, Damascus, early 20th century, brass with copper and silver inlay - Huntington Museum of Art - DSC05063.JPG",
    "license": "CC0",
    "artist": "Daderot",
    "source": "https://commons.wikimedia.org/wiki/File:Tray_incised_across_top_with_12_tribes,_figure_of_Moses_and_Ten_Commandments,_Syria,_Damascus,_early_20th_century,_brass_with_copper_and_silver_inlay_-_Huntington_Museum_of_Art_-_DSC05063.JPG",
    "files": {
      "sm": {
        "webp": "tex-calligraphy-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 28
      },
      "md": {
        "webp": "tex-calligraphy-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 88
      },
      "lg": {
        "webp": "tex-calligraphy-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 180
      }
    }
  },
  {
    "name": "tex-lamp",
    "note": "Lampu masjid",
    "ratio": "21:9",
    "title": "Ravensburg Mevlana-Moschee Gebetsraum Leuchter 01.jpg",
    "license": "CC BY 3.0",
    "artist": "Photo: Andreas Praefcke",
    "source": "https://commons.wikimedia.org/wiki/File:Ravensburg_Mevlana-Moschee_Gebetsraum_Leuchter_01.jpg",
    "files": {
      "sm": {
        "webp": "tex-lamp-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 43
      },
      "md": {
        "webp": "tex-lamp-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 117
      },
      "lg": {
        "webp": "tex-lamp-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 200
      }
    }
  },
  {
    "name": "tex-dome-detail",
    "note": "Kubah geometris biru",
    "ratio": "21:9",
    "title": "PK Thatta asv2020-02 img08 Shah Jahan Mosque.jpg",
    "license": "FAL",
    "artist": "A.Savin",
    "source": "https://commons.wikimedia.org/wiki/File:PK_Thatta_asv2020-02_img08_Shah_Jahan_Mosque.jpg",
    "files": {
      "sm": {
        "webp": "tex-dome-detail-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 110
      },
      "md": {
        "webp": "tex-dome-detail-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 419
      },
      "lg": {
        "webp": "tex-dome-detail-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 884
      }
    }
  },
  {
    "name": "tex-prayer-hall",
    "note": "Ruang sholat",
    "ratio": "21:9",
    "title": "Islamic Congregational Prayer with Physical Distancing during the Covid-19 Pandemic.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "AWG97",
    "source": "https://commons.wikimedia.org/wiki/File:Islamic_Congregational_Prayer_with_Physical_Distancing_during_the_Covid-19_Pandemic.jpg",
    "files": {
      "sm": {
        "webp": "tex-prayer-hall-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 32
      },
      "md": {
        "webp": "tex-prayer-hall-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 83
      },
      "lg": {
        "webp": "tex-prayer-hall-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 138
      }
    }
  },
  {
    "name": "tex-desert",
    "note": "Gurun pasir",
    "ratio": "21:9",
    "title": "Desert Sand Dunes near sunset.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "FuriousYogi",
    "source": "https://commons.wikimedia.org/wiki/File:Desert_Sand_Dunes_near_sunset.jpg",
    "files": {
      "sm": {
        "webp": "tex-desert-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 15
      },
      "md": {
        "webp": "tex-desert-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 35
      },
      "lg": {
        "webp": "tex-desert-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 59
      }
    }
  },
  {
    "name": "tex-silhouette",
    "note": "Siluet musafir gurun",
    "ratio": "21:9",
    "title": "Standing on a sand dune.JPG",
    "license": "CC BY-SA 4.0",
    "artist": "Alexandar Vujadinovic",
    "source": "https://commons.wikimedia.org/wiki/File:Standing_on_a_sand_dune.JPG",
    "files": {
      "sm": {
        "webp": "tex-silhouette-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 3
      },
      "md": {
        "webp": "tex-silhouette-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 8
      },
      "lg": {
        "webp": "tex-silhouette-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 14
      }
    }
  },
  {
    "name": "tex-rock",
    "note": "Batu gunung",
    "ratio": "21:9",
    "title": "Lost Palms (4388551237).jpg",
    "license": "CC BY 2.0",
    "artist": "Chris M Morris",
    "source": "https://commons.wikimedia.org/wiki/File:Lost_Palms_(4388551237).jpg",
    "files": {
      "sm": {
        "webp": "tex-rock-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 75
      },
      "md": {
        "webp": "tex-rock-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 222
      },
      "lg": {
        "webp": "tex-rock-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 402
      }
    }
  },
  {
    "name": "tex-night-dark",
    "note": "Masjid malam gelap",
    "ratio": "21:9",
    "title": "Premavati Mosque at night.jpg",
    "license": "CC BY 4.0",
    "artist": "Sawarijoshi",
    "source": "https://commons.wikimedia.org/wiki/File:Premavati_Mosque_at_night.jpg",
    "files": {
      "sm": {
        "webp": "tex-night-dark-sm.webp",
        "w": 700,
        "h": 300,
        "kb": 9
      },
      "md": {
        "webp": "tex-night-dark-md.webp",
        "w": 1300,
        "h": 557,
        "kb": 26
      },
      "lg": {
        "webp": "tex-night-dark-lg.webp",
        "w": 1900,
        "h": 814,
        "kb": 47
      }
    }
  },
  {
    "name": "divider-zellige",
    "note": "Zellige biru-putih",
    "ratio": "24:1",
    "title": "Samarkand Shah-i Zinda Tuman Aqa complex cropped2.jpg",
    "license": "CC BY 3.0",
    "artist": "User:Patrickringgenberg",
    "source": "https://commons.wikimedia.org/wiki/File:Samarkand_Shah-i_Zinda_Tuman_Aqa_complex_cropped2.jpg",
    "files": {
      "sm": {
        "webp": "divider-zellige-sm.webp",
        "w": 700,
        "h": 29,
        "kb": 7
      },
      "md": {
        "webp": "divider-zellige-md.webp",
        "w": 1300,
        "h": 54,
        "kb": 15
      },
      "lg": {
        "webp": "divider-zellige-lg.webp",
        "w": 1900,
        "h": 79,
        "kb": 21
      }
    }
  },
  {
    "name": "divider-star",
    "note": "Ubin bintang",
    "ratio": "24:1",
    "title": "Citadelle d'Alep - motif circulaire.jpg",
    "license": "CC BY 3.0",
    "artist": "",
    "source": "https://commons.wikimedia.org/wiki/File:Citadelle_d%27Alep_-_motif_circulaire.jpg",
    "files": {
      "sm": {
        "webp": "divider-star-sm.webp",
        "w": 700,
        "h": 29,
        "kb": 8
      },
      "md": {
        "webp": "divider-star-md.webp",
        "w": 1300,
        "h": 54,
        "kb": 29
      },
      "lg": {
        "webp": "divider-star-lg.webp",
        "w": 1900,
        "h": 79,
        "kb": 59
      }
    }
  },
  {
    "name": "divider-dome",
    "note": "Kubah emas",
    "ratio": "24:1",
    "title": "Blue Mosque Ceiling Blue Tiles.JPG",
    "license": "CC BY-SA 3.0",
    "artist": "Bjørn Christian Tørrissen",
    "source": "https://commons.wikimedia.org/wiki/File:Blue_Mosque_Ceiling_Blue_Tiles.JPG",
    "files": {
      "sm": {
        "webp": "divider-dome-sm.webp",
        "w": 700,
        "h": 29,
        "kb": 10
      },
      "md": {
        "webp": "divider-dome-md.webp",
        "w": 1300,
        "h": 54,
        "kb": 34
      },
      "lg": {
        "webp": "divider-dome-lg.webp",
        "w": 1900,
        "h": 79,
        "kb": 62
      }
    }
  },
  {
    "name": "divider-mosaic",
    "note": "Mosaik kaca",
    "ratio": "24:1",
    "title": "Ceiling of Tabatabaee mosque at Fatima Masumeh Shrine, qom, iran2.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Amir Pashaei",
    "source": "https://commons.wikimedia.org/wiki/File:Ceiling_of_Tabatabaee_mosque_at_Fatima_Masumeh_Shrine,_qom,_iran2.jpg",
    "files": {
      "sm": {
        "webp": "divider-mosaic-sm.webp",
        "w": 700,
        "h": 29,
        "kb": 9
      },
      "md": {
        "webp": "divider-mosaic-md.webp",
        "w": 1300,
        "h": 54,
        "kb": 35
      },
      "lg": {
        "webp": "divider-mosaic-lg.webp",
        "w": 1900,
        "h": 79,
        "kb": 75
      }
    }
  },
  {
    "name": "card-menara-kudus",
    "note": "Masjid Menara Kudus — arsitektur Indonesia",
    "ratio": "4:3",
    "title": "Masjid Menara Kudus.jpg",
    "license": "CC0",
    "artist": "PL09Puryono",
    "source": "https://commons.wikimedia.org/wiki/File:Masjid_Menara_Kudus.jpg",
    "files": {
      "sm": {
        "webp": "card-menara-kudus-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 33
      },
      "md": {
        "webp": "card-menara-kudus-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 75
      },
      "lg": {
        "webp": "card-menara-kudus-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 117
      }
    }
  },
  {
    "name": "card-bismillah",
    "note": "Kaligrafi Bismillah",
    "ratio": "4:3",
    "title": "Bismillah in Calligraphy.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Laisurw2020",
    "source": "https://commons.wikimedia.org/wiki/File:Bismillah_in_Calligraphy.jpg",
    "files": {
      "sm": {
        "webp": "card-bismillah-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 15
      },
      "md": {
        "webp": "card-bismillah-md.webp",
        "w": 1224,
        "h": 918,
        "kb": 28
      },
      "lg": {
        "webp": "card-bismillah-lg.webp",
        "w": 1224,
        "h": 918,
        "kb": 28
      }
    }
  },
  {
    "name": "card-menara-minar",
    "note": "Masjid saat fajar",
    "ratio": "4:3",
    "title": "Blue Mosque In Dawn (122678105).jpeg",
    "license": "CC BY 3.0",
    "artist": "\nNithi Ruangpisit",
    "source": "https://commons.wikimedia.org/wiki/File:Blue_Mosque_In_Dawn_(122678105).jpeg",
    "files": {
      "sm": {
        "webp": "card-menara-minar-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 10
      },
      "md": {
        "webp": "card-menara-minar-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 27
      },
      "lg": {
        "webp": "card-menara-minar-lg.webp",
        "w": 1639,
        "h": 1229,
        "kb": 46
      }
    }
  },
  {
    "name": "card-prayer-hall",
    "note": "Ruang sholat berjamaah",
    "ratio": "4:3",
    "title": "Islamic Congregational Prayer with Physical Distancing during the Covid-19 Pandemic.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "AWG97",
    "source": "https://commons.wikimedia.org/wiki/File:Islamic_Congregational_Prayer_with_Physical_Distancing_during_the_Covid-19_Pandemic.jpg",
    "files": {
      "sm": {
        "webp": "card-prayer-hall-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 52
      },
      "md": {
        "webp": "card-prayer-hall-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 121
      },
      "lg": {
        "webp": "card-prayer-hall-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 188
      }
    }
  },
  {
    "name": "card-arch-hall",
    "note": "Arkade & lengkung",
    "ratio": "4:3",
    "title": "Courtyard of the Selimiye Mosque pillar detail2.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Dosseman",
    "source": "https://commons.wikimedia.org/wiki/File:Courtyard_of_the_Selimiye_Mosque_pillar_detail2.jpg",
    "files": {
      "sm": {
        "webp": "card-arch-hall-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 53
      },
      "md": {
        "webp": "card-arch-hall-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 191
      },
      "lg": {
        "webp": "card-arch-hall-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 382
      }
    }
  },
  {
    "name": "card-tile-green",
    "note": "Masjid di tepi air",
    "ratio": "4:3",
    "title": "Mostar Old Town Panorama 2007.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "\nRamirez",
    "source": "https://commons.wikimedia.org/wiki/File:Mostar_Old_Town_Panorama_2007.jpg",
    "files": {
      "sm": {
        "webp": "card-tile-green-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 72
      },
      "md": {
        "webp": "card-tile-green-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 219
      },
      "lg": {
        "webp": "card-tile-green-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 400
      }
    }
  },
  {
    "name": "card-desert-road",
    "note": "Gurun saat terbit",
    "ratio": "4:3",
    "title": "Dubai desert sunset 1.jpg",
    "license": "CC BY-SA 4.0",
    "artist": "Sajitkk",
    "source": "https://commons.wikimedia.org/wiki/File:Dubai_desert_sunset_1.jpg",
    "files": {
      "sm": {
        "webp": "card-desert-road-sm.webp",
        "w": 700,
        "h": 525,
        "kb": 37
      },
      "md": {
        "webp": "card-desert-road-md.webp",
        "w": 1300,
        "h": 975,
        "kb": 106
      },
      "lg": {
        "webp": "card-desert-road-lg.webp",
        "w": 1900,
        "h": 1425,
        "kb": 195
      }
    }
  },
  {
    "name": "banner-dome-blue",
    "note": "Kubah biru bermotif",
    "ratio": "16:6",
    "title": "Sheikh-Lotf-Allah mosque wall and ceiling.jpg",
    "license": "CC BY 3.0",
    "artist": "Phillip Maiwald Nikopol",
    "source": "https://commons.wikimedia.org/wiki/File:Sheikh-Lotf-Allah_mosque_wall_and_ceiling.jpg",
    "files": {
      "sm": {
        "webp": "banner-dome-blue-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 80
      },
      "md": {
        "webp": "banner-dome-blue-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 238
      },
      "lg": {
        "webp": "banner-dome-blue-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 400
      }
    }
  },
  {
    "name": "banner-tile-geo",
    "note": "Ubin bintang geometris",
    "ratio": "16:6",
    "title": "Citadelle d'Alep - motif circulaire.jpg",
    "license": "CC BY 3.0",
    "artist": "",
    "source": "https://commons.wikimedia.org/wiki/File:Citadelle_d%27Alep_-_motif_circulaire.jpg",
    "files": {
      "sm": {
        "webp": "banner-tile-geo-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 67
      },
      "md": {
        "webp": "banner-tile-geo-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 236
      },
      "lg": {
        "webp": "banner-tile-geo-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 495
      }
    }
  },
  {
    "name": "banner-sunset",
    "note": "Masjid saat senja",
    "ratio": "16:6",
    "title": "Sultan Omar Ali Saifuddin Mosque 02.jpg",
    "license": "CC BY 2.0",
    "artist": "sam garza from Los Angeles, USA",
    "source": "https://commons.wikimedia.org/wiki/File:Sultan_Omar_Ali_Saifuddin_Mosque_02.jpg",
    "files": {
      "sm": {
        "webp": "banner-sunset-sm.webp",
        "w": 700,
        "h": 262,
        "kb": 27
      },
      "md": {
        "webp": "banner-sunset-md.webp",
        "w": 1300,
        "h": 487,
        "kb": 71
      },
      "lg": {
        "webp": "banner-sunset-lg.webp",
        "w": 1900,
        "h": 712,
        "kb": 127
      }
    }
  }
];

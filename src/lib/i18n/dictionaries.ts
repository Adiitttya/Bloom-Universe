export type Locale = "en" | "id";

export const dictionaries = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      gallery: "Gallery",
      ecosystem: "Ecosystem",
      joinDiscord: "JOIN DISCORD",
      joinDiscordCommunity: "JOIN DISCORD COMMUNITY",
      officialPortal: "Official Portal",
    },
    hero: {
      title: "The Ultimate Hangout to Game, Chill & Make Real Friends",
      subtitle:
        "Welcome to Bloom Universe! Whether you're looking for a late-night gaming squad, cozy movie watch parties, deep voice chats, or simply a place to vibe, you'll always find your circle here.",
      primaryCta: "JOIN OUR DISCORD",
      secondaryCta: "EXPLORE ECOSYSTEM",
      badge: "BLOOMUN!",
    },
    about: {
      title: "More Than Just a Discord Server",
      description:
        "Bloom Universe is built for people who want to expand their circle, find gaming partners, hop into movie watch parties, or simply share late-night banter in voice channels.",
      stats: {
        totalMembers: "Total Community Members",
        onlineMembers: "Members Online Now",
        voiceMembers: "Active in Voice Channels",
      },
      pillars: {
        "pillar-1": {
          number: "01",
          title: "Squad Up & Play",
          description:
            "Never game alone. Find teammates for Valorant, Mobile Legends, Roblox, Minecraft, or casual party games in seconds.",
        },
        "pillar-2": {
          number: "02",
          title: "Watch & Chill Nights",
          description:
            "Cozy community movie streams, anime watch parties, music jamming sessions, and spontaneous voice lounge hangouts.",
        },
        "pillar-3": {
          number: "03",
          title: "Make Real Friends & Vibe",
          description:
            "A warm, welcoming, and wholesome environment to network, share passions, tell stories, and build genuine friendships.",
        },
        p1: {
          number: "01",
          title: "Squad Up & Play",
          description:
            "Never game alone. Find teammates for Valorant, Mobile Legends, Roblox, Minecraft, or casual party games in seconds.",
        },
        p2: {
          number: "02",
          title: "Watch & Chill Nights",
          description:
            "Cozy community movie streams, anime watch parties, music jamming sessions, and spontaneous voice lounge hangouts.",
        },
        p3: {
          number: "03",
          title: "Make Real Friends & Vibe",
          description:
            "A warm, welcoming, and wholesome environment to network, share passions, tell stories, and build genuine friendships.",
        },
      },
    },
    gallery: {
      title: "Moments & Highlights",
      description:
        "Capturing the funniest voice lounge moments, epic gaming clutches, community tournaments, and creative memories across the Bloom Universe.",
      photoOf: (current: number, total: number) =>
        `Photo ${current} of ${total}`,
      prev: "Previous photo",
      next: "Next photo",
      close: "Close popup",
    },
    ecosystem: {
      title: "Explore Our Digital Ecosystem",
      description:
        "Interactive community web apps, photobooths, and gaming portals crafted exclusively for Bloom Universe members.",
      liveNow: "LIVE NOW",
      comingSoon: "COMING SOON",
      inDev: "IN DEVELOPMENT",
      openPortal: "OPEN PORTAL",
      portals: {
        photobooth: {
          title: "Bloom Photobooth",
          description:
            "Snap cute polaroids & custom aesthetic frames with your Discord besties.",
        },
        minecraft: {
          title: "Bloom SMP Server",
          description:
            "Build, survive, and embark on epic quests in our official Minecraft world.",
        },
        roblox: {
          title: "Bloom Roblox World",
          description:
            "Hang out, play custom mini-games, and explore our community map on Roblox.",
        },
        store: {
          title: "Bloom Store",
          description:
            "Exclusive community merch, collectible server badges, and special perks.",
        },
        social: {
          title: "Bloom Social",
          description:
            "A cozy feed to share memes, fanart, gaming clips, and daily community stories.",
        },
        bot: {
          title: "Bloom Bot Dashboard",
          description:
            "Custom music player, leveling leaderboards, economy games, and automated server utilities.",
        },
      },
    },
    socials: {
      title: "Stay Connected Everywhere",
      description:
        "Never miss a gaming tournament, movie watch party, meme drop, or community announcement. Join the conversation on all our verified channels.",
      visit: "VISIT →",
      platforms: {
        discord: {
          name: "Discord Server",
          handle: "Official Community Hub",
        },
        tiktok: {
          name: "TikTok Official",
          handle: "@bloom.unvrse",
        },
        instagram: {
          name: "Instagram Official",
          handle: "@bloom.unvrse",
        },
      },
    },
    footer: {
      description:
        "The official home of Bloom Universe. A friendly Discord community to chill, game together, watch streams, and make genuine friends.",
      joinDiscord: "JOIN DISCORD COMMUNITY",
      navigation: "Navigation",
      hubs: "Community Hubs",
      adminPortal: "Member Login",
      copyright: (year: number) =>
        `© ${year} Bloom Universe. Built for the community.`,
    },
    login: {
      backHome: "Back to Homepage",
      title: "Sign In to Bloom Universe",
      subtitle:
        "Connect with your verified Discord account to explore all features, participate in community events, and access all services.",
      loginButton: "LOGIN WITH DISCORD",
      copyright: (year: number) =>
        `© ${year} Bloom Universe. Built for the community.`,
    },
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      gallery: "Galeri",
      ecosystem: "Ekosistem",
      joinDiscord: "GABUNG DISCORD",
      joinDiscordCommunity: "GABUNG KOMUNITAS DISCORD",
      officialPortal: "Portal Resmi",
    },
    hero: {
      title: "Tempat Nongkrong Seru Buat Mabar, Nobar & Cari Teman Asik",
      subtitle:
        "Selamat datang di Bloom Universe! Tempat kumpul seru buat kamu yang ingin cari teman baru, mabar game favorit, nobar film bareng, atau sekadar ngobrol santai di voice channel. Temukan circle ternyamanmu di sini!",
      primaryCta: "GABUNG DISCORD KAMI",
      secondaryCta: "JELAJAHI EKOSISTEM",
      badge: "BLOOMUN!",
    },
    about: {
      title: "Lebih dari Sekadar Server Discord",
      description:
        "Bloom Universe hadir sebagai wadah hangat untuk memperluas pertemanan, menemukan teman mabar, streaming bareng, hingga seru-seruan berbagi cerita di voice channel.",
      stats: {
        totalMembers: "Total Anggota Komunitas",
        onlineMembers: "Sedang Online Sekarang",
        voiceMembers: "Sedang Aktif di Voice",
      },
      pillars: {
        "pillar-1": {
          number: "01",
          title: "Mabar Seru Bareng",
          description:
            "Nggak ada lagi main sendirian. Temukan rekan squad untuk Valorant, Mobile Legends, Roblox, Minecraft, atau game santai lainnya dalam hitungan detik.",
        },
        "pillar-2": {
          number: "02",
          title: "Nobar & Nongkrong Santai",
          description:
            "Nonton bareng film & anime favorit, dengerin musik bareng, hingga obrolan larut malam yang seru di voice lounge.",
        },
        "pillar-3": {
          number: "03",
          title: "Cari Teman & Relasi Baru",
          description:
            "Komunitas yang ramah, hangat, dan anti-toxic untuk berbagi hobi, bertukar cerita, dan menjalin persahabatan nyata.",
        },
        p1: {
          number: "01",
          title: "Mabar Seru Bareng",
          description:
            "Nggak ada lagi main sendirian. Temukan rekan squad untuk Valorant, Mobile Legends, Roblox, Minecraft, atau game santai lainnya dalam hitungan detik.",
        },
        p2: {
          number: "02",
          title: "Nobar & Nongkrong Santai",
          description:
            "Nonton bareng film & anime favorit, dengerin musik bareng, hingga obrolan larut malam yang seru di voice lounge.",
        },
        p3: {
          number: "03",
          title: "Cari Teman & Relasi Baru",
          description:
            "Komunitas yang ramah, hangat, dan anti-toxic untuk berbagi hobi, bertukar cerita, dan menjalin persahabatan nyata.",
        },
      },
    },
    gallery: {
      title: "Momen & Keseruan Komunitas",
      description:
        "Kumpulan momen lucu di voice lounge, clutch epik saat mabar, turnamen seru, dan kenangan berharga di Bloom Universe.",
      photoOf: (current: number, total: number) =>
        `Foto ${current} dari ${total}`,
      prev: "Foto sebelumnya",
      next: "Foto selanjutnya",
      close: "Tutup popup",
    },
    ecosystem: {
      title: "Jelajahi Ekosistem Digital Kami",
      description:
        "Aplikasi web interaktif, photobooth bertema, dan portal game eksklusif yang dirancang khusus untuk anggota Bloom Universe.",
      liveNow: "SUDAH RILIS",
      comingSoon: "SEGERA HADIR",
      inDev: "DALAM TAHAP PENGEMBANGAN",
      openPortal: "BUKA PORTAL",
      portals: {
        photobooth: {
          title: "Bloom Photobooth",
          description:
            "Abadikan momen seru dengan frame polaroid custom estetik bersama teman Discord-mu.",
        },
        minecraft: {
          title: "Bloom SMP Server",
          description:
            "Bangun, bertahan hidup, dan berpetualang bersama di server Minecraft resmi komunitas.",
        },
        roblox: {
          title: "Bloom Roblox World",
          description:
            "Nongkrong, main mini-game seru, dan jelajahi map custom komunitas kami di Roblox.",
        },
        store: {
          title: "Bloom Store",
          description:
            "Merchandise eksklusif komunitas, badge koleksi server, dan keuntungan khusus anggota.",
        },
        social: {
          title: "Bloom Social",
          description:
            "Feed santai untuk berbagi meme, fanart, klip gaming, dan cerita harian komunitas.",
        },
        bot: {
          title: "Bloom Bot Dashboard",
          description:
            "Music player custom, leaderboard level, mini game ekonomi, dan bot utility otomatis.",
        },
      },
    },
    socials: {
      title: "Terhubung di Seluruh Media Sosial",
      description:
        "Jangan lewatkan info turnamen gaming, jadwal nobar, konten meme, dan pengumuman komunitas terbaru di semua akun resmi kami.",
      visit: "KUNJUNGI →",
      platforms: {
        discord: {
          name: "Server Discord",
          handle: "Pusat Komunitas Resmi",
        },
        tiktok: {
          name: "TikTok Resmi",
          handle: "@bloom.unvrse",
        },
        instagram: {
          name: "Instagram Resmi",
          handle: "@bloom.unvrse",
        },
      },
    },
    footer: {
      description:
        "Rumah resmi komunitas Bloom Universe. Server Discord ramah untuk nongkrong, mabar game, nobar, dan mencari teman baru.",
      joinDiscord: "GABUNG KOMUNITAS DISCORD",
      navigation: "Navigasi",
      hubs: "Hub Komunitas",
      adminPortal: "Login Member",
      copyright: (year: number) =>
        `© ${year} Bloom Universe. Dibuat untuk komunitas.`,
    },
    login: {
      backHome: "Kembali ke Beranda",
      title: "Masuk ke Bloom Universe",
      subtitle:
        "Hubungkan akun Discord terverifikasimu untuk menikmati semua fitur, mengikuti event komunitas, dan mengakses seluruh portal.",
      loginButton: "MASUK DENGAN DISCORD",
      copyright: (year: number) =>
        `© ${year} Bloom Universe. Dibuat untuk komunitas.`,
    },
  },
};

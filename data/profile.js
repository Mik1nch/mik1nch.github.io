const PROFILE = {
  alias: "Mikinch",
  id: "MIK-01",
  location: "Digital Node / Anywhere",
  role: "Digital Creator",
  status: "ONLINE",
  mode: "Anonymous",
  focus: ["Art", "Code", "Slides", "Support"],
  tagline: "Digital creator.",
  description: "Technical. A bit bold. Slightly strange. Creative. Not corporate. Carefully chaotic. A personal digital world.",
  contacts: {
    telegram: {
      url: "https://t.me/mikinch",
      label: "Telegram",
      note: "Личная связь. Вопросы, заказы, предложения и просто сообщения."
    },
    tiktok: {
      url: "https://www.tiktok.com/@mikinch",
      label: "TikTok",
      note: "ТикТок канал для ознакомления с моими работами по артам и рисованию."
    },
    pinterest: {
      url: "https://pin.it/155nbSQLT",
      label: "Pinterest",
      note: "Эстетичные картинки, референсы и визуальные находки."
    },
    github: {
      url: "https://github.com/mik1nch",
      label: "GitHub",
      note: "Код, эксперименты и открытые проекты."
    }
  },
  services: {
    code: {
      title: "CODE",
      items: [
        "Сайты и лендинги",
        "Telegram-боты",
        "Небольшие программы",
        "Скрипты и автоматизация",
        "AI-assisted tools"
      ]
    },
    art: {
      title: "ART",
      items: [
        "Anime-style art",
        "Аватарки",
        "Баннеры",
        "Карточки товаров",
        "Визуальный контент"
      ]
    },
    slides: {
      title: "SLIDES",
      items: [
        "Презентации",
        "Дизайн слайдов",
        "Визуальные истории",
        "Pitch decks"
      ]
    },
    support: {
      title: "SUPPORT",
      items: [
        "Персональная поддержка",
        "Разговор и разбор ситуации",
        "Понятные объяснения",
        "Советы (не терапия)"
      ],
      note: "Это НЕ медицинская и НЕ психотерапевтическая услуга. Решения и ответственность за действия остаются у пользователя."
    }
  },
  about: {
    whatIDo: [
      "Рисунок и anime-style art",
      "Сайты",
      "Код",
      "Telegram-боты",
      "Небольшие программы",
      "Презентации",
      "Дизайн",
      "Аватарки и баннеры",
      "Карточки товаров для маркетплейсов",
      "AI-assisted visual/content work",
      "Персональная поддержка / разговор"
    ],
    offTheClock: {
      gaming: "Геймер. Из-за слабого железа предпочитает хорошо оптимизированные игры. Brawl Stars, Roblox.",
      music: "Любит музыку.",
      anime: "Любит anime-style визуал. Страшилки. Различные взрослые режимы."
    },
    personalNote: "Анонимность — часть образа. Лицо необязательно показывать. Это личный цифровой узел, а не корпоративная витрина."
  }
};

if (typeof module !== "undefined") {
  module.exports = PROFILE;
}

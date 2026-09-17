# Mikinch — personal website

Статический сайт-визитка для GitHub Pages.

## Структура

- `index.html` — главная
- `services.html` — услуги
- `portfolio.html` — портфолио
- `about.html` — обо мне
- `contact.html` — контакты
- `profile.html` — профиль
- `style.css` — дизайн и анимации
- `script.js` — интерактивность
- `data/profile.js` — информация, которую удобно менять

## Как менять профиль

Открой `data/profile.js` и измени значения в объекте `MIKINCH_PROFILE`.

## Как добавить контакты

В том же файле замени:

```js
contacts: {
  telegram: "#",
  discord: "#",
  email: "#",
  github: "#"
}
```

на реальные ссылки.

## Публикация

Репозиторий должен называться `mik1nch.github.io`, а GitHub Pages можно включить в:

**Settings → Pages → Deploy from a branch → main → / (root)**

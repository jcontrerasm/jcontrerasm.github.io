export const SITE = {
  name: 'Juan Carlos Contreras Meneses',
  githubUser: 'jcontrerasm',
  linkedin: 'https://www.linkedin.com/in/juan-carlos-raul-contreras-meneses/',
  github: 'https://github.com/jcontrerasm',
  medium: 'https://medium.com/@jcontrerasmeneses',
  role: {
    es: 'Arquitecto DevSecOps',
    en: 'DevSecOps Architect',
  },
} as const;

export const NAV = {
  es: [
    { href: '/es/', label: 'Sobre mí' },
    { href: '/es/blog/', label: 'Artículos' },
  ],
  en: [
    { href: '/en/', label: 'About me' },
    { href: '/en/blog/', label: 'Articles' },
  ],
} as const;

export const SITE = {
  name: 'Juan Carlos Contreras',
  githubUser: 'jcontrerasm',
  linkedin: 'https://www.linkedin.com/in/juan-carlos-raul-contreras-meneses/',
  github: 'https://github.com/jcontrerasm',
  role: {
    es: 'Arquitecto DevSecOps',
    en: 'DevSecOps Architect',
  },
} as const;

export const NAV = {
  es: [
    { href: '/es/', label: 'Inicio' },
    { href: '/es/blog/', label: 'Blog' },
    { href: '/es/contacto/', label: 'Contacto' },
  ],
  en: [
    { href: '/en/', label: 'Home' },
    { href: '/en/blog/', label: 'Blog' },
    { href: '/en/contact/', label: 'Contact' },
  ],
} as const;

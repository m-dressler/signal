# dynamic/i18n

A showcase example on how i18n could be powered by dynamic values

## Use

```ts
// A map of translations for different languages
const translations = {
    en: { hello: "Hello {name}!" },
    es: { hello: "¡Hola {name}!" },
};
// Find the first supported language with fallback to en
const language = window.navigator.languages.find(lang => translations[lang]) || 'en';

// Create i18n instance with that translation
const { t } = i18n(translations[language]);

// Initialize our dynamic value
const name = dynamic('Sandra');
const translated = t('hello', { name });

// Test 
translated.listen(console.log);
name.value = 'Tony';
```
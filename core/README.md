# dynamic/core

The core piece to enabling truly reactive values without overhead or compilation.

The premise is really simple, you wrap a value which other logic needs to react to in `dynamic(value)` and others will know when it changed. The main application currently is in the module `@dynamic/html` which enables a reactive DOM.

## Use

```ts
const example = dynamic('');
example.listen(next => console.log("Value:", next));
example.value = 'hello'; // Logs "Value: hello"

const exclaimed = example.derive(next => next + "!");
exclaimed.listen(next => console.log("Exclaimed:", next));
example.value += ' world'; // Logs "Value: hello world" and "Exclaimed: hello world!"
```
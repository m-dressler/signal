# Signal

A group of features all centered around one idea: create truly reactive values without overhead or compilation.

The premise is really simple, you wrap a value which other logic needs to react to in `Signal(value)` and others will know when it changed. The main application currently is in the module `@signal/html` which enables a reactive DOM.

## Use

```ts
const example = Signal('');
example.listen(next => console.log("Value:", next));
example.value = 'hello'; // Logs "Value: hello"

const exclaimed = example.derive(next => next + "!");
exclaimed.listen(next => console.log("Exclaimed:", next));
example.value += ' world'; // Logs "Value: hello world" and "Exclaimed: hello world!"
```
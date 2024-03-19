# dynamic/html

Make the DOM dynamic by creating elements through this module's API which automatically updates dynamic values on the element.

## Use

```ts
const name = dynamic('Static?');
const hidden = dynamic(false);

const h1 = createElement('h1', {
    innerText: name,
    style: {
        display: hidden.derive(next => next ? 'none' : '')
    }
});
document.body.append(h1);

setTimeout(() => name.value = 'Dynamic!', 1e4);
setInterval(() => hidden.value = true, 1e4)
```
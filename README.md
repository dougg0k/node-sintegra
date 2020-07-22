# Node Sintegra

### Realize consultas no Sintegra dos estados suportados

> O bypass do captcha é feito utilizando OCR com TesseractJs, porém o tempo de consulta e aleatório, por conta de que ao falhar em identificar as letras no captcha, uma nova tentativa é feita.

```
npm install node-sintegra
```

```javascript
const { acessarSintegra } = require('node-sintegra');

try {
  const data = await acessarSintegra(cnpj: string, estado: string);
  ...
} catch(err) {
  ...
}
```

---

Lista de estados suportados:

- SP

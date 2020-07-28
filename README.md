# Node Sintegra

### Realize consultas no Sintegra dos estados suportados

> O bypass do captcha é feito utilizando OCR com TesseractJs, porém o tempo de consulta e aleatório, por conta de que ao falhar em identificar as letras no captcha, uma nova tentativa é feita. Porem nem todos possuem captchas.

```
npm install node-sintegra
```

Para ter acesso a certos estados, a instalação do `ImageMagick` ou `GraphicsMagick` no sistema é necessária.

```javascript
const { acessarSintegra } = require('node-sintegra');

try {
  const data = await acessarSintegra(cnpj: string, estadoSigla: string);
  ...
} catch(err) {
  ...
}
```

---

> Certos testes podem falhar em caso parte do sistema do sintegra em certo estado não estiver online, exemplo, as vezes o sistema demonstra apenas parte do resultado junto a uma mensagem avisando que parte do sistema esta com erro ou offline. Porem os resultados não disponiveis podem retornar como `null` ou `undefined` ou apenas `string` vazia.

> Resultados são diferentes para cada estado, veja a interface [Sintegra](https://github.com/dougg0k/node-sintegra/blob/master/src/sintegra/Sintegra.ts).

---

Lista de estados:

- AC (não suportado, resultado em pdf)
- AL
- AP (não suportado, resultado em pdf)
- AM (não suportado, contêm google recaptcha)
- BA
- CE (não suportado, contêm google recaptcha)
- DF
- ES (não suportado, contêm google recaptcha)
- GO
- MA (não suportado, contêm google recaptcha)
- MT (não suportado, possui captcha com maior dificuldade)
- MS (não suportado, possui captcha com maior dificuldade)
- MG (não suportado, contêm google recaptcha)
- PA (não suportado, contêm google recaptcha)
- PB (não suportado, contêm google recaptcha)
- PR (não confirmado)
- PE (não confirmado)
- PI (não suportado, contêm google recaptcha)
- RJ (não confirmado)
- RN (não confirmado)
- RS (não suportado, contêm google recaptcha)
- RO (não confirmado)
- RR (não confirmado)
- SC (não confirmado)
- SP
- SE (não confirmado)
- TO (não suportado, contêm google recaptcha)

# Invitación de Laura y Jorge — múltiples invitados

La página usa un solo sitio web y personaliza el nombre y los cupos mediante la URL.

## Agregar o modificar invitados

Edita únicamente el archivo:

```text
invitados.js
```

Copia un bloque existente y cambia:

- La clave: minúsculas, sin espacios ni tildes, separada por guiones.
- `nombre`
- `tratamiento`
- `cupos`

Ejemplo:

```javascript
"carlos-lopez": {
  nombre: "Carlos López",
  tratamiento: "y acompañante",
  cupos: 2
}
```

## Enlaces personalizados

URL base:

```text
https://jorgeceledon.github.io/invitacion-laura-jorge/
```

Ejemplo:

```text
https://jorgeceledon.github.io/invitacion-laura-jorge/?i=francesco-monachello
```

Para Carlos López:

```text
https://jorgeceledon.github.io/invitacion-laura-jorge/?i=carlos-lopez
```

Después de editar `invitados.js`, guarda el archivo en GitHub. GitHub Pages volverá a publicar la página automáticamente.

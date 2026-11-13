---
title: "Antipatrón de índice como clave en React"
description: "Por qué la propiedad key es clave para el renderizado de React y cómo usar el índice del arreglo como valor puede romper el comportamiento de tus componentes."
pubDate: 2019-09-06
lang: es
tags: ["React", "JavaScript", "Optimización", "Front-end"]
---

![Imagen de portada del artículo](/images/blog/indices-como-clave-react/img-01.jpeg)
*Imagen: pixabay.com*

En este artículo explicaré cuál es la importancia de la propiedad **key** en React y cómo su mal uso podría causarnos problemas al momento de desarrollar nuestras aplicaciones.

Sabemos que la manipulación de los elementos en el DOM es costosa. React utiliza varias técnicas para que este proceso se resuelva de manera óptima, sin embargo, hay ocasiones en que como desarrolladores, debemos ayudar a optimizar este proceso.

El apoyo que podemos brindar a React reside en la propiedad **key**, la cual utiliza para poder relacionar elementos que se han cargado en el DOM y que luego se compararán para evaluar si deben ser representados nuevamente o no.

A continuación, veremos que con una asignación de valor incorrecta a la propiedad **key**, nuestro componente puede no actuar de la manera que esperamos.

> El siguiente ejemplo está realizado con la versión 16.8.0 de React, la cual incorpora nuevas características, entre ellas el uso de Hooks. Si aún no está familiarizado con esta nueva forma de trabajo, lo invito a obtener más información en [la documentación de Hooks](https://es.reactjs.org/docs/hooks-intro.html).

## El problema

Tenemos una lista de productos que se encuentra representada por la constante **data**.

![Constante data con la lista de productos](/images/blog/indices-como-clave-react/img-02.png)

Luego implementamos el componente `App`, que contiene un estado **product** que se inicializa con el valor de **data** para representar la lista de productos.

![Componente App usando el índice como key](/images/blog/indices-como-clave-react/img-03.png)

Como podemos ver, el componente también contiene un manejador de eventos que permitirá agregar un producto más a la lista en la parte superior. Observemos cómo se ve en la pantalla…

![Lista de productos en pantalla](/images/blog/indices-como-clave-react/img-04.png)

Ahora, asignemos una cantidad a cada producto.

![Cantidades asignadas a cada producto](/images/blog/indices-como-clave-react/img-05.png)

Una vez hecho esto, añadiremos otro producto pulsando en el botón **"Agregar"** y veamos lo que sucede.

![Resultado tras agregar un producto: las cantidades quedan en posiciones incorrectas](/images/blog/indices-como-clave-react/img-06.png)

Podemos observar que algo está mal. 😱

Vemos que a los productos se les han asignado cantidades incorrectas y estos valores han persistido de acuerdo a la posición que tenían en el arreglo.

Veamos cuál fue el flujo de renderizado…

![Flujo de renderizado con el índice como key: múltiples actualizaciones en el DOM](/images/blog/indices-como-clave-react/img-07.jpeg)

En el gráfico anterior podemos observar que React está realizando varias actualizaciones en el DOM, cuando lo único que debería hacer es insertar los elementos necesarios en la parte superior.

Esto se debe a que en nuestra implementación del componente, la propiedad **key** tiene el valor de **index**, que representa la posición del elemento en cada iteración. Entonces, al realizar un cambio de estado, React procesa el componente y compara el DOM con el DOM Virtual y, al existir un elemento con la **key** de la posición inicial (posición 0), solo actualiza lo que no coincide, en este caso solo el nombre del producto y no la caja de texto. De igual manera sucede con el segundo elemento (posición 1), mientras que con el tercero, al no existir una **key** con ese valor (posición 2), React inserta un nuevo elemento en la parte inferior de la lista de productos.

## La solución

Para solucionar esto, lo que deberíamos hacer como buena práctica es asignar a la propiedad **key** un valor único e irrepetible para cada elemento. En este caso podríamos usar la propiedad **id**.

![Componente App usando el id como key](/images/blog/indices-como-clave-react/img-08.png)

Ahora, ingresamos las cantidades por producto y luego le damos en el botón **"Agregar"**.

![Cantidades por producto antes de agregar un nuevo elemento](/images/blog/indices-como-clave-react/img-09.png)

Veamos cómo fue el proceso de renderizado de React…

![Flujo de renderizado con el id como key: solo se inserta el nuevo elemento](/images/blog/indices-como-clave-react/img-10.jpeg)

Como vemos, ahora el componente no presenta ninguna alteración en su comportamiento y no realiza ninguna actualización adicional en el DOM, logrando así optimizar el proceso de renderizado de nuestro componente. 😁

## Conclusiones

Como hemos visto, tenemos que tener siempre presente que la propiedad **key** es de mucha importancia para React y debemos tener cuidado al momento de asignarle un valor. Recordar que este valor debe ser único e irrepetible en el contexto de elementos hermanos. Si logramos esto, podremos sacar el mayor provecho a la librería en cuestión de rendimiento.

Muchas gracias por el tiempo y espero que este artículo haya sido de ayuda.

Puedes seguirme en Twitter como [@jcontrerasm_dev](https://twitter.com/jcontrerasm_dev) o en GitHub como [@jcontrerasm](https://github.com/jcontrerasm).

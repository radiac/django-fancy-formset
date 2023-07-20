============
Installation
============

There are two ways to add django-fancy-formset to your site - to the HTML as a script,
to your JavaScript bundle as a module, or directly in the browser as a module. If you're
not sure, use it as a script.

You will either need to build your formset HTML in a specific way, or pass configuration
options when initialising the formsets - see :doc:`configuration`.

If you prefer to see it working in a project, there is an `example Django site`__ in the
git repository.

__  https://github.com/radiac/django-fancy-formset/tree/develop/example


As a script
===========

Add to your page directly - here we'll use `unpkg <https://unpkg.com/>`_ and pin it to
the latest release of version 1, but you could copy the files into your Django static
dir instead:

.. code-block:: html

    <html>
      <head>
        <!-- Optional styles -->
        <link rel="stylesheet" href="https://unpkg.com/django-fancy-formset@^1/dist/formset.min.css">
      </head>
      <body>
        <!-- Django formset goes here -->
        <script src="https://unpkg.com/django-fancy-formset@^1"></script>
        <script>formset.init();</script>
      </body>
    </html>


As a module
===========

Alternatively you can install from NPM:

.. code-block:: bash

    npm install django-fancy-formset


In your code:

.. code-block:: javascript

    import { init as init_formsets } from 'django-fancy-formset';

    document.addEventListener('DOMContentLoaded', e => {
      init_formsets();
    });


As a module in the browser
==========================

You can also use it as a module directly from your HTML - here we'll assume you've
copied ``formset.module.js`` into your Django static:

.. code-block:: html

    <script type="module">
      import { init } from "{% static "formset.module.js" %}";

      window.addEventListener("DOMContentLoaded", e => { init() });
    </script>

If you'd prefer to use unpkg, the url is
``https://unpkg.com/django-fancy-formset@^1/dist/formset.module.js``.

============================
JavaScript-only Installation
============================

For most common uses, the Python package provides a convenient way to use the library -
see :doc:`installation-django` instructions for details.

For more advanced usage, the core of the project is the JavaScript `NPM package`__,
which you can use directly without needing to install the Django app.

.. note::

    If you are using the Django package, the JavaScript is already in your static files;
    you do not need to follow these instructions.

There are three ways to add the JavaScript library to your site - to the HTML as a
script, to your JavaScript bundle as a module, or directly in the browser as a module.
If you're not sure, use it as a script.

You will either need to build your formset HTML in a specific way, or pass configuration
options when initialising the formsets - see :doc:`configuration`.

If you prefer to see it working in a project, see the ``Author`` form in the `example
Django site`__ in the git repository.

__ https://www.npmjs.com/package/django-fancy-formset
__  https://github.com/radiac/django-fancy-formset/tree/main/example


As a script
===========

Add to your page directly:

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

Here we're using the unpkg CDN, pinned to the latest release of version 1, but you could
copy the files into your Django static dir instead.


As a module
===========

Alternatively you can install from NPM:

.. code-block:: bash

    npm install django-fancy-formset


and import it in your code:

.. code-block:: javascript

    import { init as init_formsets } from 'django-fancy-formset';
    import 'django-fancy-formset/dist/formset.min.css';  // optional

    document.addEventListener('DOMContentLoaded', e => {
      init_formsets();
    });


As a module in the browser
==========================

You can also use the JavaScript module directly from your HTML - here we'll assume
you've copied ``formset.module.js`` into your Django static dir:

.. code-block:: html

    <script type="module">
      import { init } from "{% static "formset.module.js" %}";

      window.addEventListener("DOMContentLoaded", e => { init() });
    </script>

If you'd prefer to use unpkg, the url is:

    https://unpkg.com/django-fancy-formset@^1/dist/formset.module.js

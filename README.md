# django-fancy-formset

This is a plain JavaScript library to let users add and remove forms in a
[Django](https://www.djangoproject.com/) inline formset.

![Add and remove forms in an inline formset](https://raw.githubusercontent.com/radiac/django-fancy-formset/master/docs/example.gif)

Features:

* No dependencies, just 5kB of plain JavaScript
* Apply to formsets manually, or automatically via a ``data-`` attribute
* Raises events to allow for customisation
* Class based and designed to be extended
* Default styling available


## Quickstart

Add to your page directly using `unpkg <https://unpkg.com/>`_:

.. code-block:: html

    <html>
      <head>
        <!-- Optional styles -->
        <link rel="stylesheet" href="https://unpkg.com/django-fancy-formset@^2/dist/styles.js">
      </head>
      <body>
        <!-- Django formset goes here -->
        <script src="https://unpkg.com/django-fancy-formset@^2"></script>
        <script>formset.init();</script>
      </body>
    </html>


You can also use it as module - see installation documentation.


Render your formset in your Django template. The template structure which will work with
the default configuration is:

```django
  <form method="post">
    {% csrf_token %}
    {{ form.as_p }}

    <h2>Formset</h2>
    <div data-formset="{{ formset.prefix }}">   {# Formset container to target #}
      {{ formset.management_form }}             {# Add the management form #}
      <fieldset style="display: none">          {# Add and hide the empty form #}
        {{ formset.empty_form.as_p }}
      </fieldset>
      {% for form in formset %}
        <fieldset>                              {# Each formset form has a container #}
        {{ form.as_p }}                         {# Actual form layout doesn't matter #}
        </fieldset>
      {% endfor %}
    </div>

    <button type="submit">Save</button>
  </form>
```

This can all be customised with options passed as `formset.init(options)` - see
configuration documentation for details.

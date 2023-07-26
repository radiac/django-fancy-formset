# django-fancy-formset

This is a plain JavaScript library to let users add and remove forms in a Django inline
formset. It can be installed from PyPI as a Django app, from NPM as a JavaScript module,
or linked to directly from your HTML.

[![PyPi version](https://badgen.net/pypi/v/django-fancy-formset/)](https://pypi.org/project/django-fancy-formset)
[![Npm version](https://badgen.net/npm/v/django-fancy-formset)](https://npmjs.com/package/django-fancy-formset)
[![Documentation](https://readthedocs.org/projects/django-fancy-formset/badge/?version=latest)](https://django-fancy-formset.readthedocs.io/en/latest/?badge=latest)
[![CI](https://github.com/radiac/django-fancy-formset/actions/workflows/ci.yml/badge.svg)](https://github.com/radiac/django-fancy-formset/actions/workflows/ci.yml)


Features:

* No dependencies, just 5kB of plain JavaScript
* Apply to formsets manually, or automatically via a ``data-`` attribute
* Optional Django app to simplify usage
* Raises events to allow for customisation
* Class based and designed to be extended
* Default styling available


<p align="center" width="100%">
  <kbd>
    <img src="https://github.com/radiac/django-fancy-formset/raw/main/docs/example.gif" alt="Add and remove forms in an inline formset">
  </kbd>
</p>


## Quickstart using Python

Install with:

```bash
pip install django-fancy-formset
```

Add to your ``INSTALLED_APPS``, then create your formsets using the provided
fancy formset classes:

```python
from fancy_formset import FancyInlineFormSet

BookInlineFormSet = forms.inlineformset_factory(
    Author, Book, formset=InlineFancyFormSet,
)
```

then leave it to Django to render your formset:

```django
{{ formset.media }}
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  {{ formset.as_p }}
  <button type="submit">Save</button>
</form>
```

See the
[Django installation documentation](https://django-fancy-formset.readthedocs.io/en/latest/installation-django.html)
for more details

## Quickstart using JavaScript

The Python package is a thin wrapper around the JavaScript package. For more control,
you can integrate it yourself.

Add to your page directly using [unpkg](https://unpkg.com/):

```html
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
```

You can also use it in your bundler or browser as module - see the
[JavaScript-only installation documentation](https://django-fancy-formset.readthedocs.io/en/latest/installation-javascript.html)
for more details

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

This can all be customised with options passed as `formset.init(options)` - see the
[configuration documentation](https://django-fancy-formset.readthedocs.io/en/latest/configuration.html)
for details.


## Find out more

For full installation and usage instructions, as well as information on events, the API
and customisation, see the
[documentation](https://django-fancy-formset.readthedocs.io/en/latest/).

===================
Django Installation
===================

The ``django-fancy-formset`` `PyPI package`__ is a Django app, and is the easiest way to
use the library. It will add the JavaScript to your static files, so for most
installations these are the only instructions you will need.

For more advanced usage, you can use the JavaScript package with or without this Django
app - see the :doc:`JavaScript installation <installation-javascript>` instructions
instead.

If you prefer to see it working in a project, see the ``Review`` formset in the `example
Django site`__ in the git repository.

__ https://pypi.org/project/django-fancy-formset/
__  https://github.com/radiac/django-fancy-formset/tree/main/example


Add to your Django project
==========================

First install the Django package:

.. code-block:: bash

    pip install django-fancy-formset


then add it to your ``INSTALLED_APPS`` settings:

.. code-block:: python

    INSTALLED_APPS = [
      ...
      "fancy_formset",
    ]


The minified JavaScript and CSS files should now be available through ``staticfiles``.


Formset classes
===============

The Django package defines three formset classes which will add the static JavaScript
and CSS resources to the ``formset.media``, and set up the formset HTML in a way that
the JavaScript is expecting.

Pass them into the appropriate formset factory as the ``formset`` argument.

You have three formset classes you can use:

``fancy_formset.FancyFormSet``:
  A set of forms.

  Equivalent to ``django.forms.formsets.BaseFormSet`` (`Django docs`__).

  Usage:

  .. code-block:: python

      from django.forms import formset_factory
      from fancy_formset import FancyFormSet
      from .forms import ArticleForm

      ArticleFormSet = formset_factory(ArticleForm, formset=FancyFormSet)

  __ https://docs.djangoproject.com/en/4.2/topics/forms/formsets/#django.forms.formsets.BaseFormSet

``fancy_formset.FancyModelFormSet``:
  A set of forms for one model.

  Equivalent to ``django.forms.models.BaseModelFormSet`` (`Django docs`__).

  Usage:

  .. code-block:: python

      from django.forms import modelformset_factory
      from fancy_formset import FancyModelFormSet
      from .models import Author

      AuthorFormSet = modelformset_factory(
          Author,
          fields=["name", "title"],
          formset=FancyModelFormSet,
        )

  __ https://docs.djangoproject.com/en/4.2/topics/forms/modelforms/#django.forms.models.BaseModelFormSet

``fancy_formset.FancyInlineFormSet``:
  A set of forms for one model which is related to another model - like inline formsets
  in Django's admin site.

  Equivalent to ``django.forms.models.BaseInlineFormSet`` (`Django docs`__).

  Usage:

  .. code-block:: python

      from django.forms import inlineformset_factory
      from fancy_formset import FancyInlineFormSet
      from .models import Author, Book

      BookFormSet = inlineformset_factory(
        Author,
        Book,
        fields=["title"],
        formset=FancyInlineFormSet,
      )

  __ https://docs.djangoproject.com/en/4.2/topics/forms/modelforms/#django.forms.models.BaseInlineFormSet


Customising options
-------------------

You can pass :ref:`options <options>` to the JavaScript library by setting a dict
``fancy_options`` on the formset class. It will be serialised to JSON. For example:

.. code-block:: python

      from django.forms import inlineformset_factory
      from fancy_formset import FancyInlineFormSet
      from .models import Author, Book

      class BaseBookFormSet(FancyInlineFormSet):
          fancy_options = {
            "pkFieldName": "uuid",
            "allowDeleteAtMin": True,
          }

      BookFormSet = inlineformset_factory(
        Author,
        Book,
        fields=["title"],
        formset=BaseBookFormSet,
      )


Use in templates
================

The formsets come with templates for ``as_p``, ``as_table``, ``as_div`` and ``as_ul``.
They also add the static resources to the ``formset.media``.

To use a ``FancyFormSet`` or ``FancyModelFormSet`` in a template:

.. code-block:: django

    {{ formset.media }}
    <form method="post">
      {% csrf_token %}
      {{ formset.as_p }}
      <button type="submit">Save</button>
    </form>

To use a ``FancyInlineFormSet``:

.. code-block:: django

    {{ formset.media }}
    <form method="post">
      {% csrf_token %}
      {{ form.as_p }}
      {{ formset.as_p }}
      <button type="submit">Save</button>
    </form>


Customising the templates
-------------------------

Standard Django fieldset templates render their forms without containers. Because
django-fancy-formset needs to be able to add and remove the forms, it wraps each form in
a ``<fieldset>`` element.

This means that ``as_table`` and ``as_ul`` include the ``<table>`` and ``<ul>``
elements, unlike Django's standard fieldset templates which expect you to define those
yourself. If this doesn't work for your templates, you can write your own formset
template to iterate over the forms yourself.

See the `fieldset templates`__ for examples of what django-fancy-formset would like by
default, and :doc:`configuration` for details of how to make more drastic changes to
your HTML structure.

__ https://github.com/radiac/django-fancy-formset/tree/main/fancy_formset/templates/fancy_formset
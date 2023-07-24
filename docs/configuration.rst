=============
Configuration
=============

First prepare your Django templates to use a supported `HTML structure`_, and then
`initialise the formsets`_ using the configuration `options`_ to customise how your
formset works.


HTML Structure
==============

By default, django-fancy-formset would like you to construct your formset in a specific
way:

.. code-block:: jinja

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

* set a ``data-formset="prefix"`` attribute on the formset container so it can be found
  by ``init()``
* put each form in its own ``fieldset`` container, as direct children of the formset
  container
* add a ``formset.empty_form`` in a container as one of the forms, to act as a template
* remember to add the ``formset.management_form`` somewhere

It doesn't matter what your formset forms look like, just as long as they're in a
container.

If you want to construct your formset differently, you can :doc:`extend the classes
<extending>` to override the defaults.

.. note::

    All inline ``style="..."`` attributes are removed from the empty form container when
    it is copied, so you can set ``style="display: none"`` on the empty form to hide it.

    If you want to add styles to the form container, you should use CSS classes. If you
    want to hide it in a different way, see `options`_, :doc:`events` and
    :doc:`extending`.


Styling your formset
--------------------

There is a default stylesheet available which:

* Adds some basic fieldset styling to make your form clearer to use
* Styles the delete button to hide the form being deleted
* Styles the add button

This is available as ``formset.min.css`` if you want to use it directly, or
``formset.css`` (or ``src/formset.scss`` in github) if you want to use it as a starting
point.


Initialise the formsets
=======================

If your formsets follow the expected HTML structure above, you can initialise all of the
formsets on a page at once by calling ``init()`` with no arguments.

For example, you can do this in the HTML from the bottom of your ``body`` tag:

.. code-block:: html

      <script>
        formset.init();
      </script>
    </body>

or once the DOM is ready from your JavaScript bundle:

.. code-block:: javascript

    import { init } from 'django-fancy-formset';

    document.addEventListener('DOMContentLoaded', e => {
      init();
    });


You can also customise which formsets are initialised and how they work by specifying
`options`_ and `targets`_:

.. code-block:: javascript

    formset.init(options, targets);


.. _options:

Specifying options
------------------

You can configure the formsets using an ``options`` object - for example:

.. code-block:: javascript

    formset.init(
      {
        formSelector: 'div.form',
        templateSelector: 'div.form.form-template',
        allowDeleteAtMin: true
      }
    );


.. js:autoattribute:: options

.. js:autoattribute:: options.formsetSelector
.. js:autoattribute:: options.formsetClass
.. js:autoattribute:: options.prefix
.. js:autoattribute:: options.prefixAttr
.. js:autoattribute:: options.formSelector
.. js:autoattribute:: options.formClass
.. js:autoattribute:: options.pkFieldName
.. js:autoattribute:: options.formsetActiveCss
.. js:autoattribute:: options.formAddedCss
.. js:autoattribute:: options.formDeletedCss
.. js:autoattribute:: options.addButtonLabel
.. js:autoattribute:: options.addButtonCss
.. js:autoattribute:: options.deleteConClosest
.. js:autoattribute:: options.deleteConCss
.. js:autoattribute:: options.formsetAtMinCss
.. js:autoattribute:: options.allowDeleteAtMin
.. js:autoattribute:: options.formsetAtMaxCss
.. js:autoattribute:: options.allowAddAtMax



.. _targets:

Specifying targets
------------------

If not all of your formsets on the page need to be initialised, or if they need
different options, you can specify a target as the second argument.

The target can be a selector, or the results of ``querySelectorAll``:

.. code-block:: javascript

    formset.init({}, 'fieldset.formset')
    formset.init({}, document.querySelectorAll('fieldset.formset'))



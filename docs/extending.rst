=======================
Extending functionality
=======================

If the :ref:`options <options>` for ``formset.init()`` don't give you enough
flexibility, you can override the internal ``Form`` and ``Formset`` classes.


Accessing the classes
=====================

If you're using it as a script, you can access the classes on ``formset``:

.. code-block:: javascript

    const Form = formset.Form;
    const Formset = formset.Formset;


If you're using it as a module, you can import them directly:

.. code-block:: javascript

    import { init, Form, Formset } from "./formset.module.js";


Create a subclass
=================

You can then subclass the classes to customise functionality.

For example, lets subclass the ``Formset`` to pop up an alert when the user tries to add
a form when they've already reached the maximum number of forms:

.. code-block:: javascript

    class AlertFormset extends Formset {
      addForm() {
        if (this.atMax) {
          alert("You are at the maximum number of forms");
          return;
        }
        super();
      }
    }


Lets also subclass the ``Form`` to alert when the user tries to delete a form when
they're already at the minimum number of forms:

.. code-block:: javascript

    class AlertForm extends Form {
      getDeleteEl() {
        let checkbox = super();
        checkbox.addEventListener('click', (e) => {
          if (this.isDeleted && this.atMin) {
            alert("You are at the minimum number of forms");
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
        return checkbox;
      }
    }


Using your subclass
===================

You can pass your subclasses into ``formset.init()`` using the options:

.. code-block:: javascript

    formset.init({
      formsetClass: AlertFormset,
      formClass: AlertForm,
    });


Alternatively, if you're doing something clever you can create the ``Formset`` class
directly - but note there will be no default options unless you specify them:

.. code-block:: javascript

    import { defaultOptions } from "formset";
    const bookFormset = new AlertFormset(
      document.getElementById('book-formset'),
      {...defaultOptions, formClass: AlertForm},
    );

======
Events
======

Changes to the formset result in the following events being raised on the formset root
element.

Relevant data about the event is passed in the event's ``detail`` object.

For example, an added form has a ``added`` CSS class. To remove it 3 seconds after the
form has been added:

.. code-block:: javascript

    formset.addEventListener(
      'formset:form-add',
      event => {
        setTimeout(
          () => { event.detail.form.el.classList.remove("added")},
          3000
        );
      }
    );


.. js:data:: formset:init

    A formset has initialised.

    You could use this to activate JavaScript widgets on form fields for forms which
    exist when the page loads.

    * ``event.detail.formset`` - the current formset


.. js:data:: formset:form-add

    A new form has been created and added to the formset.

    You could use this to activate JavaScript widgets on form fields for forms which are
    added using the add button.

    * ``event.detail.formset`` - the current formset
    * ``event.detail.form`` - the current form


.. js:data:: formset:form-activate

    A form has been activated - either it has just been added, or its delete checkbox
    has been unticked.

    This is fired directly after ``formset-addForm``. Because forms can be deactivated
    and reactivated, allow for this event to fire multiple times on the same DOM
    element.

    This event could be used to control styling, reset form fields or enable fields
    which are controlled by JavaScript.

    * ``event.detail.formset`` - the current formset
    * ``event.detail.form`` - the current form


.. js:data:: formset:form-deactivate

    A form has bee deactivated - its delete checkbox has been ticked.

    The form still exists in the DOM and its data will still be submitted. Because forms
    can be deactivated and reactivated, allow for this event to fire multiple times on
    the same DOM element.

    This event can be used to control styling, clear form fields that shouldn't be
    submitted, or disable fields which are controlled by JavaScript.

    * ``event.detail.formset`` - the current formset
    * ``event.detail.form`` - the current form


.. js:data:: formset:form-destroy

    A form has been destroyed - it has already been removed from the DOM. This is
    usually fired when the formset first initialises, when it finds and removes empty
    extra forms.

    You could use this to clean up after JavaScript field widgets.

    * ``event.detail.formset`` - the current formset
    * ``event.detail.form`` - the current form

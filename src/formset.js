/**
 * Formset management
 */


/**
 * A form within the formset.
 *
 * This is used by the Formset class to represent individual forms, and is not intended
 * for direct use.
 */
export class Form {

  /**
   * Form prefix used in the template form
   *
   * This is used to exclude it from the active forms found by formSelector
   *
   * Default: the default Django prefix ``__prefix__`` - see
   * https://docs.djangoproject.com/en/4.2/topics/forms/formsets/#empty-form
   *
   * @type {string}
   */
  templatePrefix = "__prefix__";

  // Regex pattern to match full field name prefix, set by constructor
  // Pattern is in the format /^fieldsetPrefix-(formPrefix)-(fieldName)$/
  // so matches[1] is the form instance prefix, matches[2] is the field name
  _namePattern;

  /**
   * Represent a form within a formset
   *
   * @param {Formset} formset  The formset the form is attached to.
   *
   * @param {rootEl} rootEl  The root DOM element for the form, as from
   * ``document.getElementById`` or ``document.querySelector``, for example.
   *
   * @param {options} options  The options for the formset. There are no default values.
   */
  constructor(formset, rootEl, options) {
    this.formset = formset;
    this.rootEl = rootEl;
    this.options = options;

    // Build a regex for field names in this form
    this._namePattern = new RegExp(`^${options.prefix}-([^-]+)-(.+)$`);

    // This is a template form if the first field has the __prefix__ form prefix
    this.isTemplate = (
      this.getFields()[0].name.match(this._namePattern)[1] === this.templatePrefix
    );

    this.deleteEl = this.getDeleteEl();
    this.render();
  }

  /**
   * Get the name of this form
   *
   * Primarily used for debugging; there's usually a cheaper way to get this when needed
   *
   * @returns {string} Form prefix
   */
  getPrefix() {
    // Extract the form prefix from the field names
    return this.getFields()[0].name.match(this._namePattern)[1];
  }

  /**
   * Get a list of the field elements in the form
   *
   * @returns {Array}  List of form field HTMLElements
   */
  getFields() {
    return Array.from(this.rootEl.querySelectorAll('input,select,textarea'));
  }

  /**
   * Get a lookup table of all field values, in the same order as getFields
   *
   * @returns {object}  Field name to value lookup table
   */
  getValues() {
    const fields = this.getFields();
    return fields.reduce(
      (data, fieldEl, i) => (
        data[fieldEl.name.match(this._namePattern)[2]] = fieldEl.value,
        data // (assignment, obj) lets us assign and then return obj to the reducer
      ),
      {}  // initial value for data
    );
  }

  /**
   * Check if the form has any content which doesn't match defaults
   *
   * The default values must be passed as a dict, and can only be found if there's a
   * template form specified - without that we won't know if the values were present
   * when the page loaded/refreshed
   *
   * @param {object} fieldDefaults  Field name to value, from ``getValues()``
   *
   * @returns {bool}  True if the form has content that doesn't match ``fieldDefaults``
   */
  hasContent(fieldDefaults) {
    // See if all field elements are empty (default)
    const fields = this.getFields();
    const hasContent = fields.some(
      (fieldEl, index) => {
        const fieldName = fieldEl.name.match(this._namePattern)[2]
        if (fieldName === this.options.pkFieldName) {
          if (fieldEl.value) {
            // PK is set, this form is not empty
            return true;
          }
          // PK is not set. Ignore this field and look at the rest of the form

        } else {
          // If the value does not match the default value, this form is not empty
          return (fieldEl.value !== fieldDefaults[fieldName]);
        }
      }
    );
    return hasContent;
  }

  /**
   * Get the delete input field for the form and add event listeners
   *
   * @returns {HTMLElement} Delete input field
   */
  getDeleteEl() {
    let checkbox = this.rootEl.querySelector(`[name$="-DELETE"]`);
    if (!checkbox) {
      return;
    }

    checkbox.addEventListener('click', (e) => {
      // Try to prevent going over min/max bounds
      //
      // this.isDeleted reflects the state we're entering with this click - in other
      // words, if this.isDeleted and we don't stop this click, the form is about to be
      // deleted.
      if (
        (this.isDeleted && this.formset.atMin && !this.options.allowDeleteAtMin)
        ||
        (!this.isDeleted && this.formset.atMax && !this.options.allowAddAtMax)
      ){
        e.preventDefault();
        e.stopPropagation();
      }
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        this.deleted();
      } else {
        this.undeleted();
      }
    });
    return checkbox
  }

  /**
   * Check if the form is marked as deleted
   *
   * @returns {bool} True if the form's delete checkbox is checked
   */
  get isDeleted() {
    return this.deleteEl.checked;
  }

  /**
   * Handle the change event when this form's delete checkbox has been ticked and the
   * form marked for deletion
   */
  deleted() {
    // Tell the formset it's no longer active
    this.formset.deactivateForm(this);
  }

  /**
   * Handle the change event when this form's delete checkbox has been unticked and the
   * form no longer marked for deletion
   */
  undeleted() {
    // Tell the formset it's active again
    this.formset.activateForm(this);
  }

  /**
   * Render the form whenever the formset changes or renders
   */
  render() {

    // Update root style for CSS
    this.rootEl.classList.toggle(this.options.formDeletedCss, this.isDeleted);
  }

  /**
   * Destroy the element and raise a formset-destroyForm event
   *
   * Call when the form is no longer needed and can be completely removed
   */
  destroy() {
    this.rootEl.remove();
    this.formset.destroyedForm(this);
    // Break circular reference for gc
    this.formset = null;
  }
}

/**
 * Manage a formset
 */
export class Formset {
  formClass = Form;


  /**
   * Instantiate a new formset
   *
   * @param {rootEl} rootEl  The root DOM element for the formset, as from
   * ``document.getElementById`` or ``document.querySelector``, for example.
   *
   * @param {options} options  The options for the formset. There are no default values;
   * you should provide these from ``defaultOptions``
   */
  constructor(rootEl, options) {
    this.rootEl = rootEl;

    // Update options with settings we find on the DOM
    let prefix = options.prefix || rootEl.getAttribute(options.prefixAttr);
    if (!prefix) {
      throw this._e('Formset prefix not found');
    }
    this.options = options = {
      ...options,
      "prefix": prefix,
    }

    // Find management form
    this.totalFormsEl = document.getElementById(`id_${prefix}-TOTAL_FORMS`);
    this.initialFormsEl = document.getElementById(`id_${prefix}-INITIAL_FORMS`);
    this.numFormsMin = parseInt(document.getElementById(`id_${prefix}-MIN_NUM_FORMS`).value, 10);
    this.numFormsMax = parseInt(document.getElementById(`id_${prefix}-MAX_NUM_FORMS`).value, 10);

    // Find add button
    this.addEl = this.getAddEl();

    // Collect the forms
    this.collectForms();

    // Set a flag so CSS can change its layout
    this.rootEl.classList.add(this.options.formsetActiveCss);

    // Re-render this and all forms
    this.render();
    this.event('formset:init');
  }

  /**
   * Raise an exception and attach the formset element we're working with
   *
   * @param {String} msg  Error message
   */
  _e(msg) {
    return new Error(msg, {cause: this.rootEl});
  }

  /**
   * Collect the existing form containers and turn them into Form instances
   *
   * Called by the constructor when first initialising
   *
   * @param {rootEl} rootEl  The root
   */
  collectForms() {
    this.forms = Array.from(
      this.rootEl.querySelectorAll(this.options.formSelector),
      formEl => new this.formClass(this, formEl, this.options)
    );

    // Find template form
    let templateFormIndex = this.forms.findIndex(form => form.isTemplate);
    if (templateFormIndex > -1) {
      this.template = this.forms.splice(templateFormIndex, 1)[0];
    } else {
      throw this._e(`Formset ${this.options.prefix} template form not found`);
    }

    // Update total number of forms - this may have changed if the page was refreshed
    this.numForms = this.forms.length;

    // Check for extra forms
    const initialForms = parseInt(this.initialFormsEl.value, 10);
    if (this.numForms > initialForms) {
      // We have extra forms; remove them if they're empty
      //
      // Build list of default values from the template form, so we can see if any values
      // have changed in the forms we want to remove
      //
      // Slice to shallow copy; we'll be destroying items in this.forms as we go.
      // Reverse so that if we hit the minimum, we've removed the forms at the end.
      const fieldDefaults = this.template.getValues();
      this.forms.slice().reverse().forEach(form => {
        if (this.atMin) {
          return;
        }
        if (!form.hasContent(fieldDefaults)) {
          form.destroy();
        }
      });
    };

    // Set the internal form counter. Forms are 0-indexed, so last ID is num-1
    this._nextId = this.numForms;
  }

  /**
   * Create a new add button element, add it to the end of the formset root element, and
   * bind its event handler to call ``Formset.addform()``
   *
   * Called by the constructor during initialisation.
   *
   * @returns {HTMLElement} The new button element
   */

  getAddEl() {
    let button = document.createElement('button');
    button.innerHTML = this.options.addButtonLabel;
    button.type = 'button';
    button.className = this.options.addButtonCss;
    this.rootEl.appendChild(button);
    button.onclick = () => {
      this.addForm();
    }
    return button;
  }

  /**
   * Create and insert a new form, and let all forms know the formset has changed
   */
  addForm() {
    if (this.atMax && !this.options.allowAddAtMax) {
      return;
    }

    // Get new form ID, then increment ready for next time
    let id = this._nextId++;

    // Create and insert
    let formRoot = this.createForm(id);
    let newForm = this.insertForm(id, formRoot);

    // Tell the formset it is ready
    this.activateForm(newForm);
  }

  /**
   * Re-render formset and forms
   */
  render() {
    this.forms.forEach(form => {
      form.render();
    });

    // Toggle minimum and maximum css styles
    this.rootEl.classList.toggle(this.options.formsetAtMinCss, this.atMin);
    this.rootEl.classList.toggle(this.options.formsetAtMaxCss, this.atMax);
  }

  /**
   * Get or set the current number of active forms
   *
   * Setting this will not change how many forms exist - it is for internal use after
   * adding or removing a form.
   */
  get numForms() {
    return parseInt(this.totalFormsEl.value, 10)
  }

  set numForms(value) {
    this.totalFormsEl.value = value;
  }

  /**
   * Create a new form DOM object from the template form
   *
   * @param {int} id  The unique ID for the form
   *
   * @returns {HTMLElement}  the new form root element, not attached to the DOM
   */
  createForm(id) {
    // Clone template, replacing __prefix__
    let templateHtml = this.template.rootEl.innerHTML;
    let formHtml = templateHtml.replace(/__prefix__/g, id);
    let formRoot = this.template.rootEl.cloneNode();

    // Remove inline styles - this will usually be "display:none"
    formRoot.removeAttribute("style");

    // Set added class for styling, and fill with the template
    formRoot.classList.add(this.options.formAddedCss);
    formRoot.innerHTML = formHtml;

    return formRoot
  }

  /**
   * Insert a form into the formset
   *
   * @param {int} id  The unique ID for the form
   * @param {HTMLElement} formRoot  The root element of the form, as returned by
   * ``Formset.createForm``
   *
   * @returns {Form} The Form class instance
   */
  insertForm(id, formRoot) {
    // Add to the end of the existing forms, or after the template if no forms yet
    let lastForm = this.template;
    if (this.forms.length > 0) {
      lastForm = this.forms[this.forms.length - 1];
    }
    let lastFormEl = lastForm.rootEl;
    lastFormEl.parentNode.insertBefore(formRoot, lastFormEl.nextSibling);

    // Register form
    let form = new Form(this, formRoot, this.options)
    this.forms.push(form);

    // Tell third parties the form is added
    this.event('formset:form-add', form);
    return form;
  }

  /**
   * Raise an event
   *
   * @param {string} name  The name of the event, eg ``"click"``
   * @param {Form|null} form  The form instance to raise an event on
   */
  event(name, form) {
    const detail = {
      formset: this,
      form: form,
    };
    this.rootEl.dispatchEvent(
      new CustomEvent(
        name,
        {bubbles: true, detail: detail},
      )
    );
  }

  /**
   * Called when a new form has been added to the formset, or an existing form has been
   * undeleted.
   *
   * @param {Form} form  The form instance being activated
   */
  activateForm(form) {
    this.numForms += 1
    this.render();
    this.event('formset:form-activate', form);
  }

  /**
   * Called when the form has been marked for deletion
   *
   * The form itself stays in place and will be submitted in its deleted state so it can
   * be removed from the database if necessary.
   *
   * @param {Form} form  The form instance being deactivated
   */
  deactivateForm(form) {
    this.numForms -= 1
    this.render();
    this.event('formset:form-deactivate', form);
  }

  /**
   * Called when a form has been destroyed and removed from the DOM
   *
   * @param {Form} form  The form instance being deleted
   */
  destroyedForm(form) {
    this.forms.splice(this.forms.indexOf(form), 1);
    this.numForms -= 1;
    this.render();
    this.event('formset:form-destroy', form);
  }

  /**
   * True if we're at (or above) the maximum number of forms
   */
  get atMax() {
    return this.numForms >= this.numFormsMax;
  }

  /**
   * True if we're at (or below) the minimum number of forms
   */
  get atMin() {
    return this.numForms <= this.numFormsMin;
  }
}


/**
 * @namespace options
 * @type {object}
 */
export const defaultOptions = {
  /**
   * Selector used to target the root formset element. If no target is passed to
   * ``init()``, the target defaults to
   * ``querySelectorAll(options.formsetSelector)``.
   *
   * Default: ``"[data-formset]"`` - select all DOM elements with a ``data-formset``
   * attribute
   *
   * @memberof options
  */
  formsetSelector: "[data-formset]",

  /**
   * JavaScript class to use for the formset object. Only needed if subclassing the
   * standard Formset class.
   *
   * Default: ``Formset``
   *
   * @memberof options
   * @type {Formset}
   */
  formsetClass: Formset,

  /**
   * Explicit prefix for the formset
   *
   * By default the prefix will be picked up from an attribute on the root formset
   * element (the attribute ``options.prefixAttr``, which defaults to
   * ``"data-formset"``). You only need to set ``prefix`` if you don't want to add the
   * attribute to the root formset element.
   *
   * If set, any value in ``prefixAttr`` will be ignored.
   *
   * Default: ``null`` - prefix will be collected using ``prefixAttr``
   *
   * @memberof options
   */
  prefix: null,

  /**
   * If ``prefix`` is not set, look for the formset prefix on this attribute of the root
   * formset element.
   *
   * Default: ``"data-formset"`` - the value of the ``"data-formset"`` attribute
   *
   * @memberof options
   */
  prefixAttr: "data-formset",

  /**
   * Selector to find all form containers, relative to the formset root element.
   *
   * Default: ``":scope > fieldset"`` - all direct fieldset children of the formset root
   *
   * @memberof options
   */
  formSelector: ":scope > fieldset",

  /**
   * JavaScript class to use when creating a form object. Only needed if subclassing the
   * standard ``Form`` class.
   *
   * Default: ``Form``
   *
   * @memberof options
   * @type {?Form}
   */
  formClass: Form,

  /**
   * Name of the primary key field for the form
   *
   * Default: ``"id"``
   *
   * @memberof options
   */
  pkFieldName: "id",

  /**
   * CSS class name to add to an active formset root element
   *
   * Useful for restyling interactive formsets with progressive enhancement
   *
   * Default: ``"formset-active"``
   *
   * @memberof options
   */
  formsetActiveCss: "formset-active",

  /**
   * CSS class name to add to a form added by the "Add" button
   *
   * Defaukt: ``"added"``
   *
   * @memberof options
   */
  formAddedCss: "added",

  /**
   * CSS class name to add to a form marked for deletion
   *
   * Default: ``"deleted"``
   *
   * @memberof options
   */
  formDeletedCss: "deleted",

  /**
   * Label for the formset's add ``<button>``, appended to the formset root
   *
   * Default: ``"Add"``
   *
   * @memberof options
   */
  addButtonLabel: "Add",

  /**
   * CSS class name for the formset's add <button>
   *
   * Default: ``"formset-add"``
   *
   * @memberof options
   */
  addButtonCss: "formset-add",

  /**
   * CSS class name for the formset root when it has the minimum number of active forms
   *
   * Default: ``"formset-at-min"``
   *
   * @memberof options
   */
  formsetAtMinCss: "formset-at-min",

  /**
   * Control if forms can be deleted when the formset has the minimum number of forms
   *
   * Only applies to the delete checkbox; does not affect empty form removal at startup
   *
   * Default: ``false``
   *
   * @memberof options
   * @type {bool}
   */
  allowDeleteAtMin: false,

  /**
   * CSS class name for the formset root when it has the maximum number of active forms
   *
   * Default: ``"formset-at-max"``
   *
   * @memberof options
   */
  formsetAtMaxCss: "formset-at-max",

  /**
   * Control if forms can be added when the formset has the maximum number of forms
   *
   * Default: ``false``
   *
   * @memberof options
   * @type {bool}
   */
  allowAddAtMax: false,
};


/**
 * Initialise formsets
 *
 * @param {options} options  The options for initialising the formset. Default values
 * are taken from ``defaultOptions``
 *
 * @param {String|NodeList} target  The target formset or formsets. This can be a
 * querySelector argument, a single DOM element, or list of DOM elements. If not
 * provided, searches based on options.
 *
 * @returns {Array}  A list of instantiated ``Formset`` classes.
 */
export function init(
  options = {},
  target = null,
) {
  // Process args
  options = {...defaultOptions, ...options};
  target = target || options.formsetSelector;
  let targets;
  if (target instanceof Array) {
    targets = target

  } else if (target instanceof HTMLElement) {
    targets = [target];

  } else {
    if (target && !(target instanceof NodeList)) {
      target = document.querySelectorAll(target);
    }
    targets = Array.from(target);
  }

  // TODO:: this should return a list of created formsets
  const formsets = targets.map(el => {
    return new options.formsetClass(el, options);
  });

  return formsets;
}
